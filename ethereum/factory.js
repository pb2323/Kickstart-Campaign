import web3 from "./web3";
import CampaignFactory from "./build/campaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x27E93C46916b0C5F29C4A98f6d2A645f45580ea3"
);

export default instance;
