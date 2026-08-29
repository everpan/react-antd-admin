/**
 * 正则大全
 * @see https://any-rule.vercel.app/
 *
 * 你需要的大部分规则可以通过上面的网站生成，然后复制粘贴到你的代码中。
 */
export declare const USERNAME_REGEXP: RegExp;
export declare const ALPHA_NUMERIC_ONLY_REGEXP: RegExp;
/**
 * @description 统一社会信用代码
 * @see https://creditbj.jxj.beijing.gov.cn/credit-portal/credit_service/legal/search
 *
 * @example 91110105MA0071F38D, 91110105MADDCJMC8C, 91110101MABUT67T06
 */
export declare const UNIFIED_SOCIAL_CREDIT_CODE_REGEXP: RegExp;
/**
 * @description 手机号，只要是 1 开头即可
 *
 * @example 008618311006933, +8617888829981, 19119255642
 */
export declare const MOBILE_PHONE_REGEXP: RegExp;
export declare const TELEPHONE_REGEXP: RegExp;
