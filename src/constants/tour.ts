import Shepherd from 'shepherd.js';
import type Tour from 'shepherd.js/src/types/tour';
import type Step from 'shepherd.js/src/types/step';

const options: Tour.TourOptions = {
    defaultStepOptions: {
        cancelIcon: {
            enabled: true,
        },
        buttons: [
            {
                classes: 's-button',
                text: 'Continue',
                action() {
                    this.next();
                },
            },
        ],
    },
    useModalOverlay: true,
};

/**
 * required to wait for async loaded chunks and let the tour pause until we got content
 * TODO: dig into labs statemanagement to find out if the state is mapped internally
 * and without dirty hacks
 */
const awaitElementExistence = (selector: string) => {
    return new Promise<void>(res => {
        let interval: NodeJS.Timer;
        interval = setInterval(() => {
            if (document.querySelector(selector) != null) {
                clearInterval(interval);
                res();
            }
        }, 200);
    });
};

/**
 * The other Hackaround.
 * Could probably be replaced by manipulating state-management directly.
 */
const click = (selector: string) => {
    const element = document.querySelector(selector);
    if (element instanceof HTMLElement) {
        element.click();
    }
};


const steps: Step.StepOptions[] = [
    {
        title: 'Welcome in Laboratories Tour!',
        text: 'In the next few minutes you\'ll go through the Steps on how to explore the state of the Stellar Network, create Transactions and more.',
    },
    {
        title: 'The network selector',
        text: 'This is the network selector. There are multiple Stellar Networks. You can even run your own and connect to it via the "custom" button. The most used networks are the public network and the SDF testnet. For now we\'ll stay on testnet.',
        attachTo: {
            element: '.NetworkPicker',
            on: 'bottom-end',
        },
        buttons: [
            {
                classes: 's-button',
                text: 'Continue',
                action() {
                    // TODO: think how to make this workaround less hacky
                    click('.NetworkPicker .s-buttonGroup__wrapper:first-child');
                    this.next();
                },
            },
        ],
    },
    {
        title: 'Account creation',
        text: 'Before you can start making transactions on the network, you need a keypair to an account and you need to fund that account. On testnet you can do both under the "Create account" tab.',
        attachTo: {
            element: '[href="#account-creator"]',
            on: 'bottom',
        },
        when: {
            show() {
                // TODO: think how to make this workaround less hacky
                click('[href="#account-creator"]');
            },
        },
    },
    {
        beforeShowPromise: () => awaitElementExistence('.AccountCreator__section'),
        title: 'Keypairs',
        text: 'Every account on the network starts with a keypair. You can generate a new one here.',
        attachTo: {
            element: '.AccountCreator__section .s-button',
            on: 'top',
        },
    },
    {
        title: 'Friendbot',
        text: 'To fund an account on testnet, you can utilise Friendbot! Just paste the generated public key and friendbot will give you a few XLM to use on the testnet.',
        attachTo: {
            element: '[data-testid="page-friendbot"]',
            on: 'bottom',
        },
    },
    {
        title: 'Explore Endpoints',
        text: 'The "Explore Endpoints" tab allows you to query Horizon for information about different resources on the network.',
        when: {
            show() {
                // TODO: think how to make this workaround less hacky
                click('[href="#explorer"]');
            },
        },
        attachTo: {
            element: '[href="#explorer"]',
            on: 'bottom',
        },
    },
    {
        beforeShowPromise: () => awaitElementExistence('.EndpointPicker__section'),
        title: 'Resources',
        text: 'Here you can select what resource you are looking for, for example accounts, assets or offers.',
        attachTo: {
            element: '.EndpointPicker__section nav',
            on: 'right',
        },
        buttons: [
            {
                classes: 's-button',
                text: 'Continue',
                action() {
                    click('.EndpointPicker__section nav li:first-child');
                    this.next();
                },
            },
        ],
    },
    {
        title: 'Resources',
        text: 'For most resources (e.g. accounts in this case) you can select if you want to query a specific resource by its id or if you want to list multiple. In any case Laboratory will show you fields and options you can (or need to) specify to get a result that matches your needs.',
        attachTo: {
            element: '.EndpointExplorer__picker div:nth-child(2) nav',
            on: 'bottom',
        },
    },
    {
        title: 'Build Transaction',
        text: 'Laboratory\'s "Transaction Builder" tab lets you compose transactions without writing a single line of code. This is often the easiest way to learn how Stellar transactions work.',
        attachTo: {
            element: '[href="#txbuilder"]',
            on: 'bottom',
        },
        when: {
            show() {
                click('[href="#txbuilder"]');
            },
        },
    },
    {
        beforeShowPromise: () => awaitElementExistence('.TransactionOp__config'),
        title: 'Transaction Builder',
        text: 'This form allows you to set general transaction parameters like the source account, sequence number or memo.',
        attachTo: {
            element: '.TransactionOp__config',
            on: 'top',
        },
    },
    {
        text: 'For your transactions to do anything, you need to add operations. Laboratory will show you added operations and fields depending on the type of operation here.',
        attachTo: {
            element: '.TransactionOperations',
            on: 'top',
        },
        scrollTo: true,
    },
    {
        text: 'Laboratory shows you the result of building your transaction here. This can be either error messages (if some of your parameters didn\'t match basic validation), or the transaction XDR you\'ve built along with buttons to sign or view it.',
        attachTo: {
            element: '.TransactionBuilder__result',
            on: 'top',
        },
        scrollTo: true,
    },
    {
        title: 'Sign Transaction',
        text: 'In most cases you\'ll want to sign your transaction after building it. Laboratory\'s "Sign Transaction" tab has got you covered for that.',
        attachTo: {
            element: '[href="#txsigner"]',
            on: 'bottom',
        },
        when: {
            show() {
                click('[href="#txsigner"]');
            },
        },
    },
    {
        // TODO: either "live create" XDR in a transaction builder tutorial or include example XDR to import.
        beforeShowPromise: () => awaitElementExistence('.TransactionSigner'),
        title: 'Signing Transactions',
        text: 'To import your transaction, you can either click the "Sign in Transaction Signer" button on the "Build Transaction" tab or paste it into this text field. Once the transaction has been imported, you have multiple options to sign it. For example directly with a secret key, using a hardware wallet or with browser extension wallets like albedo or freighter.',
        attachTo: {
            element: '.xdrInput__input__textarea',
            on: 'top',
        },
    },
    {
        // TODO: include example XDR to show.
        title: 'View XDR',
        text: 'Sometimes you want to know what the XDR you have is actually doing. This can be very helpful, for example your tranaction may have returned errors when you tried to submit it. The result XDR you receive from the network can show you what went wrong.',
        attachTo: {
            element: '[href="#xdr-viewer"]',
            on: 'bottom',
        },
        when: {
            show() {
                click('[href="#xdr-viewer"]');
            },
        },
    },
    {
        beforeShowPromise: () => awaitElementExistence('.xdrInput__input__textarea'),
        title: 'View XDR',
        text: 'Here you can enter your XDR by pasting it. You may also arrive here by clicking XDR (or related buttons) contained in some of Laboratory\'s sections, for example by clicking XDR in Horizon\'s responses in the "Explore Endpoints" tab.',
        attachTo: {
            element: '.xdrInput__input__textarea',
            on: 'right',
        },
    },
    {
        title: 'View XDR',
        text: 'When you have entered your XDR, you may need to change the type of the XDR. You can find the most commonly viewed types at the top of this list.',
        attachTo: {
            element: '.XdrViewer__setup .so-dropdown',
            on: 'right',
        },
    },
    {
        title: 'End of Tour',
        text: 'You now have seen all sections of Laboratory and reached the end of this tour. You can restart it at any time from the "Introduction" tab, if you whish to.',
    },
];

export const tour = new Shepherd.Tour(options);
tour.addSteps(steps);
