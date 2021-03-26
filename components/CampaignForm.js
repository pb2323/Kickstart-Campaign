import React, { Component } from "react";
import { Form, Message, Button, Input } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

export default class CampaignForm extends Component {
  state = {
    value: "",
    loading: false,
    errorMessage: "",
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const campaign = Campaign(this.props.address);
    this.setState({ loading: true });
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "ether"),
      });
      Router.replaceRoute(`/campaigns/${this.props.address}`);
      this.setState({ errorMessage: "" });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            label="ether"
            onChange={(e) => {
              this.setState({ value: e.target.value });
            }}
            value={this.state.value}
            labelPosition="right"
          />
        </Form.Field>
        <Button loading={this.state.loading} type="submit" primary>
          Contribute!
        </Button>
        <Message error header="Oops" content={this.state.errorMessage} />
      </Form>
    );
  }
}
