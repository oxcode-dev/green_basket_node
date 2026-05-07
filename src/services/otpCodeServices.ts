import { OtpCode } from "../models/index.ts"

export const fetchOtpCodeByEmail = async (email: string) => {
    return OtpCode.findFirst({
        where: { email: email },
    });
};

export const destroyOtpCode = async () => {
    return await OtpCode.deleteMany();
}