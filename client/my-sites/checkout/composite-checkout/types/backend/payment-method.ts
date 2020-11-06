/**
 * Payment method slugs as returned by the WPCOM backend.
 * These need to be translated to the values expected by
 * composite-checkout.
 *
 * Defining these as interfaces allows WPCOMPaymentMethod
 * to be treated as a discriminated union so the compiler
 * can do exhaustiveness checking. For example, in a switch
 * block such as
 *
 *     // method : WPCOMPaymentMethod
 *     switch ( method ) {
 *       case ...
 *     }
 *
 * the typescript compiler will raise an error if we forget to
 * handle all the cases.
 *
 * @see https://www.typescriptlang.org/docs/handbook/advanced-types.html#exhaustiveness-checking
 */
export type WPCOMPaymentMethod =
	| 'WPCOM_Billing_WPCOM'
	| 'WPCOM_Billing_Ebanx'
	| 'WPCOM_Billing_Ebanx_Redirect_Brazil_Tef'
	| 'WPCOM_Billing_Dlocal_Redirect_India_Netbanking'
	| 'WPCOM_Billing_Dlocal_Redirect_Indonesia_Wallet'
	| 'WPCOM_Billing_PayPal_Direct'
	| 'WPCOM_Billing_PayPal_Express'
	| 'WPCOM_Billing_Stripe_Payment_Method'
	| 'WPCOM_Billing_Stripe_Source_Alipay'
	| 'WPCOM_Billing_Stripe_Source_Bancontact'
	| 'WPCOM_Billing_Stripe_Source_Eps'
	| 'WPCOM_Billing_Stripe_Source_Giropay'
	| 'WPCOM_Billing_Stripe_Source_Ideal'
	| 'WPCOM_Billing_Stripe_Source_P24'
	| 'WPCOM_Billing_Stripe_Source_Sofort'
	| 'WPCOM_Billing_Stripe_Source_Three_D_Secure'
	| 'WPCOM_Billing_Stripe_Source_Wechat'
	| 'WPCOM_Billing_Web_Payment';
