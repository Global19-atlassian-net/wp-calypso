/**
 * External dependencies
 */
import { By } from 'selenium-webdriver';

/**
 * Internal dependencies
 */
import * as driverHelper from '../driver-helper.js';
import AsyncBaseContainer from '../async-base-container.js';

export default class ThankYouModalComponent extends AsyncBaseContainer {
	constructor( driver ) {
		super( driver, By.css( '.current-plan-thank-you' ) );
	}

	async continue() {
		return await driverHelper.clickWhenClickable(
			this.driver,
			By.css( ".current-plan-thank-you a[href*='my-plan']" )
		);
	}
}
