import { jest } from "@jest/globals";
import voucherService from "services/voucherService";
import voucherRepository from "repositories/voucherRepository";
import { conflictError } from "utils/errorUtils";

describe("VoucherService unit tests suite ", () => {

  it("should return success case for creation of voucher", async () => {

    const code = "TEST123";
    const discount = 10;
    const voucher = {
      id: 1,
      code,
      discount,
      used: false
    };

    jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(null);
    jest.spyOn(voucherRepository, "createVoucher").mockImplementationOnce((): any => {
      return voucher;
    });

    await voucherService.createVoucher(code, discount);

    expect(voucherRepository.createVoucher).toBeCalledWith(code, discount);

  });
});