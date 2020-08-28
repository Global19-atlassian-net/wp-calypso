/**
 * Internal dependencies
 */
import FindADomainComponent from '../components/find-a-domain-component.js';
import PickAPlanPage from '../pages/signup/pick-a-plan-page.js';
import MyHomePage from '../pages/my-home-page.js';

export default class LaunchSiteFlow {
	constructor( driver ) {
		this.driver = driver;
	}
	async launchFreeSite() {
		const myHomePage = await MyHomePage.Expect( this.driver );
		await myHomePage.launchSiteFromSiteSetup();

		const findADomainComponent = await FindADomainComponent.Expect( this.driver );
		await findADomainComponent.skipSuggestion();

		const pickAPlanPage = await PickAPlanPage.Expect( this.driver );
		await pickAPlanPage.selectFreePlan();

		return await myHomePage.isSiteLaunched();
	}
}
