import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";
import CampaignFactory from "../ethereum/factory";
import Layout from "../components/Layout";
import Link from "next/link";

export default class index extends Component {
  static async getInitialProps() {
    const campaign = await CampaignFactory.methods.getDeployedCampaign().call();
    return { campaign };
  }
  renderCampaigns() {
    const items = this.props.campaign.map((address) => {
      return {
        header: address,
        description: (
          <Link href={`campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
      };
    });
    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Open Campaigns</h3>
          <Link href="/campaigns/new">
            <Button
              floated="right"
              content="Create Campaign"
              icon="add circle"
              primary
            />
          </Link>
          {this.renderCampaigns()}
        </div>
      </Layout>
    );
  }
}
