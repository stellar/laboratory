"use client";

import { Card, Link, Text, Button, Icon } from "@stellar/design-system";

import "../styles.scss";

export default function CreateAccount() {
  return (
    <div className="Account">
      <Card>
        <div className="CardText">
          <Text size="lg" as="h1" weight="medium">
            Keypair Generator
          </Text>

          <Text size="sm" as="p">
            These keypairs can be used on the Stellar network where one is
            required. For example, it can be used as an account master key,
            account signer, and/or as a stellar-core node key.
          </Text>
        </div>
        <div className="CardText__button">
          <Button size="md" variant="tertiary">
            Generate keypair
          </Button>
        </div>
      </Card>
    </div>
  );
}
