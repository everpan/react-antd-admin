import type { TFunction } from "i18next";
export declare const FORM_REQUIRED: {
    required: boolean;
}[];
/**
 * 用户名规则验证函数
 */
export declare function USERNAME_RULES(t: TFunction<"translation", undefined>): ({
    required: boolean;
    message: string;
    pattern?: undefined;
} | {
    pattern: RegExp;
    message: string;
    required?: undefined;
})[];
/**
 * 密码规则验证函数
 *
 */
export declare function PASSWORD_RULES(t: TFunction<"translation", undefined>): ({
    required: boolean;
    message: string;
    pattern?: undefined;
} | {
    pattern: RegExp;
    message: string;
    required?: undefined;
})[];
/**
 * 仅允许字母和数字的规则函数
 *
 */
export declare function ALPHA_NUMERIC_ONLY_RULES(t: TFunction<"translation", undefined>): ({
    required: boolean;
    message: string;
    pattern?: undefined;
} | {
    pattern: RegExp;
    message: string;
    required?: undefined;
})[];
/**
 * 获取统一社会信用代码校验规则
 *
 */
export declare function UNIFIED_SOCIAL_CREDIT_CODE_RULES(t: TFunction<"translation", undefined>): ({
    required: boolean;
    message: string;
    pattern?: undefined;
} | {
    pattern: RegExp;
    message: string;
    required?: undefined;
})[];
/**
 * 返回手机验证规则对象
 *
 */
export declare function MOBILE_PHONE_RULES(t: TFunction<"translation", undefined>): ({
    required: boolean;
    message: string;
    pattern?: undefined;
} | {
    pattern: RegExp;
    message: string;
    required?: undefined;
})[];
export declare function TELEPHONE_RULES(t: TFunction<"translation", undefined>): ({
    required: boolean;
    message: string;
    pattern?: undefined;
} | {
    pattern: RegExp;
    message: string;
    required?: undefined;
})[];
export declare function PHONE_RULE(t: TFunction<"translation", undefined>): {
    validator: (_: unknown, value: string) => Promise<void>;
};
