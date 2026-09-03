import { z } from "zod";
export declare const schemas: {
    fetchAddRoleItem: {
        body: z.ZodObject<{
            id: z.ZodOptional<z.ZodNumber>;
            name: z.ZodString;
            code: z.ZodString;
            status: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<0>]>;
            remark: z.ZodOptional<z.ZodString>;
            menus: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
        }, z.core.$strip>;
        data: z.ZodObject<{
            id: z.ZodOptional<z.ZodNumber>;
            name: z.ZodString;
            code: z.ZodString;
            status: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<0>]>;
            remark: z.ZodOptional<z.ZodString>;
            menus: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
        }, z.core.$strip>;
    };
    fetchDeleteRoleItem: {
        body: z.ZodNumber;
        data: z.ZodNumber;
    };
    fetchMenuByRoleId: {
        query: z.ZodObject<{
            id: z.ZodNumber;
        }, z.core.$strip>;
        data: z.ZodArray<z.ZodNumber>;
    };
    fetchRoleList: {
        query: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            code: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<0>]>>;
            current: z.ZodOptional<z.ZodNumber>;
            pageSize: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
        data: z.ZodObject<{
            list: z.ZodArray<z.ZodObject<{
                id: z.ZodNumber;
                createTime: z.ZodNumber;
                updateTime: z.ZodNumber;
                name: z.ZodString;
                code: z.ZodString;
                status: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<0>]>;
                remark: z.ZodString;
            }, z.core.$strip>>;
            total: z.ZodNumber;
            pageSize: z.ZodNumber;
            current: z.ZodNumber;
        }, z.core.$strip>;
    };
    fetchRoleMenu: {
        data: z.ZodArray<z.ZodObject<{
            parentId: z.ZodNumber;
            id: z.ZodNumber;
            menuType: z.ZodNumber;
            name: z.ZodString;
        }, z.core.$strip>>;
    };
    fetchUpdateRoleItem: {
        body: z.ZodObject<{
            id: z.ZodOptional<z.ZodNumber>;
            name: z.ZodString;
            code: z.ZodString;
            status: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<0>]>;
            remark: z.ZodOptional<z.ZodString>;
            menus: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
        }, z.core.$strip>;
        data: z.ZodObject<{
            id: z.ZodOptional<z.ZodNumber>;
            name: z.ZodString;
            code: z.ZodString;
            status: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<0>]>;
            remark: z.ZodOptional<z.ZodString>;
            menus: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
        }, z.core.$strip>;
    };
};
