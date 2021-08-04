/**
 * @jest-environment jsdom
 */
import React from 'react';
import {fireEvent, screen} from '@testing-library/react';
import StellarSdk from 'stellar-sdk';
import AccountCreator from '../AccountCreator';
import { render } from "../../helpers/testHelpers";

jest.mock('stellar-sdk');

test("it should generate a keypair", async () => {
    const PUBLIC_KEY = "foo";
    const SECRET_KEY = "bar";
    render(<AccountCreator />);
    StellarSdk.Keypair.random.mockReturnValue({
      publicKey: () => PUBLIC_KEY,
      secret: () => SECRET_KEY
    });
    fireEvent.click(screen.getByText(/Generate keypair/i));
  
    const publicKeyresult = await screen.getByTestId("publicKey");

    expect(publicKeyresult).toHaveTextContent(PUBLIC_KEY);
    expect(screen.getByTestId("secretKey")).toHaveTextContent(SECRET_KEY);  
});
