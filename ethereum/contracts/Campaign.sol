pragma solidity ^0.4.17;

contract campaignFactory {
    address[] public deployedContracts;

    function createCampaign(uint256 minimum) {
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedContracts.push(newCampaign);
    }

    function getDeployedCampaign() public view returns (address[]) {
        return deployedContracts;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool completed;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) approvers;
    uint256 public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint256 minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approversCount++;
        approvers[msg.sender] = true;
    }

    function createRequest(
        string description,
        uint256 value,
        address recipient
    ) public restricted {
        Request memory newRequest =
            Request({
                description: description,
                value: value,
                recipient: recipient,
                completed: false,
                approvalCount: 0
            });
        requests.push(newRequest);
    }

    function approveRequest(uint256 index) public {
        Request storage request = requests[index];
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        require(!request.completed);
        request.approvalCount++;
        request.approvals[msg.sender] = true;
    }

    function finalizeRequest(uint256 index) public restricted {
        Request storage request = requests[index];
        require(!request.completed);
        require(request.approvalCount > (approversCount / 2));
        request.recipient.transfer(request.value);
        request.completed = true;
    }
}
