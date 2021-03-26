import React, { Component } from "react";
import { Button, Table } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

export default class RequestRow extends Component {
  onApprove = async () => {
    const campaign = Campaign(this.props.address);
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    await campaign.methods
      .approveRequest(this.props.id)
      .send({ from: accounts[0] });

    Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
  };

  onFinalize = async () => {
    const campaign = Campaign(this.props.address);
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    await campaign.methods
      .finalizeRequest(this.props.id)
      .send({ from: accounts[0] });
    Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
  };

  render() {
    const { Row, Cell } = Table;
    const { id, request, approversCount } = this.props;
    const isFinalized = request.approvalCount > approversCount / 2;
    return (
      <Row
        disabled={request.completed}
        positive={!request.completed && isFinalized}
      >
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>{request.approvalCount + "/" + approversCount}</Cell>
        <Cell>
          {request.completed ? null : (
            <Button color="green" basic onClick={this.onApprove}>
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {request.completed ? null : (
            <Button color="teal" basic onClick={this.onFinalize}>
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}
