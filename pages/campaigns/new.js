import React, { Component } from "react";
import Layout from "../../components/Layout";
import { Form, Button, Input, Message } from "semantic-ui-react";
import factory from "../../ethereum/factory";
import { Router } from "../../routes";

export default class newPage extends Component {
  state = {
    minimumContribution: "",
    errorMessage: "",
    loading: false,
  };

  onSubmit = async (e) => {
    this.setState({ loading: true, errorMessage: "" });
    try {
      e.preventDefault();
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({ from: accounts[0] });
      Router.pushRoute("/");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h3>Create a new Campaign</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              value={this.state.minimumContribution}
              onChange={(e) => {
                this.setState({ minimumContribution: e.target.value });
              }}
              label="wei"
              labelPosition="right"
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>
            Create
          </Button>
        </Form>
      </Layout>
    );
  }
}
