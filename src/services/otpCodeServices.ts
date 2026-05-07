import { OtpCode } from "../models/index.ts"
import { OtpCodeType } from "../types/index.ts";

export const fetchOtpCodeByEmail = async (email: string) => {
    return OtpCode.findFirst({
        where: { email: email },
    });
};

export const destroyOtpCode = async () => {
    return await OtpCode.deleteMany();
}

export const destroyOtpCodeByEmail = async (email: string) => {
    return await OtpCode.deleteMany({
        where: {email: email}
    });
}

export const storeOtpCode = async (data: Omit<OtpCodeType, "id">) => {
    return await OtpCode.create({
        data: data,
    })
}