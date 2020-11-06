/**
 * External dependencies
 */
import { By } from 'selenium-webdriver';
import config from 'config';
import assert from 'assert';

/**
 * Internal dependencies
 */
import LoginFlow from '../lib/flows/login-flow.js';

import GutenbergEditorComponent from '../lib/gutenberg/gutenberg-editor-component';
import SecurePaymentComponent from '../lib/components/secure-payment-component.js';

import * as driverManager from '../lib/driver-manager';
import * as driverHelper from '../lib/driver-helper';
import * as dataHelper from '../lib/data-helper';

const mochaTimeOut = config.get( 'mochaTimeoutMS' );
const startBrowserTimeoutMS = config.get( 'startBrowserTimeoutMS' );
const screenSize = driverManager.currentScreenSize();
const host = dataHelper.getJetpackHost();

let driver;

before( async function () {
	this.timeout( startBrowserTimeoutMS );
	driver = await driverManager.startBrowser();
} );

describe( `[${ host }] Calypso Gutenberg Editor: Checkout (${ screenSize })`, function () {
	this.timeout( mochaTimeOut );

	describe( 'Can Upgrade Using The In-Editor Checkout Overlay: @parallel', function () {
		let originalCartAmount;
		step( 'Can Log In', async function () {
			this.loginFlow = new LoginFlow( driver, 'gutenbergSimpleSiteFreePlanUser' );
			return await this.loginFlow.loginAndStartNewPost( null, true );
		} );

		step( 'Can Insert The Premium Block', async function () {
			const gEditorComponent = await GutenbergEditorComponent.Expect( driver );
			await gEditorComponent.addBlock( 'Simple Payments' );
			return await driverHelper.waitTillPresentAndDisplayed(
				driver,
				By.css( '.wp-block-jetpack-simple-payments' )
			);
		} );

		step( 'Premium Block Has Clickable Upgrade Button Displayed', async function () {
			const gEditorComponent = await GutenbergEditorComponent.Expect( driver );
			await gEditorComponent.clickUpgradeOnPremiumBlock();
			return await driver.switchTo().defaultContent();
		} );

		step( 'Can View Checkout Modal', async function () {
			await driverHelper.waitTillPresentAndDisplayed( driver, By.css( '.editor-checkout-modal' ) );
			const compositeCheckoutIsPresent = await driverHelper.isElementPresent(
				driver,
				By.css( '.editor-checkout-modal' )
			);
			assert.strictEqual(
				compositeCheckoutIsPresent,
				true,
				'The In-Editor Checkout Is Not Present'
			);
		} );

		step( 'Contains Premium Plan', async function () {
			const securePaymentComponent = await SecurePaymentComponent.Expect( driver );
			const checkoutContainsPremiumPlan = await securePaymentComponent.containsPremiumPlan();
			assert.strictEqual(
				checkoutContainsPremiumPlan,
				true,
				'The In-Editor Checkout Does Not Contain The Expected Premium Plan'
			);
		} );

		step( 'Can Change Plan Length', async function () {
			const securePaymentComponent = await SecurePaymentComponent.Expect( driver );
			originalCartAmount = await securePaymentComponent.cartTotalAmount();
			await driverHelper.waitTillPresentAndDisplayed(
				driver,
				By.css( '.wp-checkout__review-order-step .checkout-step__edit-button' )
			);
			await driverHelper.clickWhenClickable(
				driver,
				By.css( '.wp-checkout__review-order-step .checkout-step__edit-button' )
			);
			const twoYearPlan = await driver.findElement(
				By.css( '.wp-checkout__review-order-step ul > li:nth-child(2) > div' )
			);
			await twoYearPlan.click();
			await driver.sleep( 1500 );
			await driverHelper.waitTillPresentAndDisplayed(
				driver,
				By.css( '.wp-checkout__review-order-step .checkout-button.is-status-primary:not(.is-busy)' )
			);
			await driverHelper.clickWhenClickable(
				driver,
				By.css( '.wp-checkout__review-order-step .checkout-button.is-status-primary:not(.is-busy)' )
			);
			const newCartAmount = await securePaymentComponent.cartTotalAmount();
			assert.notStrictEqual(
				originalCartAmount,
				newCartAmount,
				'The Cart Amounts Are the Same After Changing Plans'
			);
		} );

		step( 'Can Enter Coupon Code', async function () {
			const securePaymentComponent = await SecurePaymentComponent.Expect( driver );
			originalCartAmount = await securePaymentComponent.cartTotalAmount();
			await securePaymentComponent.enterCouponCode( dataHelper.getTestCouponCode() );
			const newCartAmount = await securePaymentComponent.cartTotalAmount();
			const expectedCartAmount =
				Math.round( ( originalCartAmount * 0.99 + Number.EPSILON ) * 100 ) / 100;

			assert.strictEqual( newCartAmount, expectedCartAmount, 'Coupon not applied properly' );
		} );

		step( 'Can Remove Coupon', async function () {
			await driver.switchTo().defaultContent();
			const securePaymentComponent = await SecurePaymentComponent.Expect( driver );
			await securePaymentComponent.removeCoupon();
			const removedCouponAmount = await securePaymentComponent.cartTotalAmount();
			assert.strictEqual( removedCouponAmount, originalCartAmount, 'Coupon not removed properly' );
		} );
	} );
} );
