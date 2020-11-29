enum BorrowerOperation {
  openLoan,
  closeLoan,
  addColl,
  withdrawColl,
  withdrawCLV,
  repayCLV,
  adjustLoan
}

export function getTroveOperationFromBorrowerOperation(operation: BorrowerOperation): string {
  switch (operation) {
    case BorrowerOperation.openLoan:
      return "openLoan";
    case BorrowerOperation.closeLoan:
      return "closeLoan";
    case BorrowerOperation.addColl:
      return "depositCollateral";
    case BorrowerOperation.withdrawColl:
      return "withdrawCollateral";
    case BorrowerOperation.withdrawCLV:
      return "mint";
    case BorrowerOperation.repayCLV:
      return "repay";
    case BorrowerOperation.adjustLoan:
      return "adjustLoan";
  }

  // AssemblyScript can't tell we will never reach this, so it insists on a return statement
  return "unreached";
}

export function isBorrowerOperation(troveOperation: string): boolean {
  return (
    troveOperation == "openLoan" ||
    troveOperation == "closeLoan" ||
    troveOperation == "depositCollateral" ||
    troveOperation == "withdrawCollateral" ||
    troveOperation == "mint" ||
    troveOperation == "repay" ||
    troveOperation == "adjustLoan"
  );
}

enum TroveManagerOperation {
  applyPendingRewards,
  liquidateInNormalMode,
  liquidateInRecoveryMode,
  partiallyLiquidateInRecoveryMode,
  redeemCollateral
}

export function getTroveOperationFromTroveManagerOperation(operation: TroveManagerOperation): string {
  switch (operation) {
    case TroveManagerOperation.applyPendingRewards:
      return "accrueRewards";
    case TroveManagerOperation.liquidateInNormalMode:
      return "liquidateInNormalMode";
    case TroveManagerOperation.liquidateInRecoveryMode:
      return "liquidateInRecoveryMode";
    case TroveManagerOperation.partiallyLiquidateInRecoveryMode:
      return "partiallyLiquidateInRecoveryMode";
    case TroveManagerOperation.redeemCollateral:
      return "redeemCollateral";
  }

  // AssemblyScript can't tell we will never reach this, so it insists on a return statement
  return "unreached";
}

export function isLiquidation(troveOperation: string): boolean {
  return (
    troveOperation == "liquidateInNormalMode" ||
    troveOperation == "liquidateInRecoveryMode" ||
    troveOperation == "partiallyLiquidateInRecoveryMode"
  );
}

export function isRecoveryModeLiquidation(troveOperation: string): boolean {
  return (
    troveOperation == "liquidateInRecoveryMode" ||
    troveOperation == "partiallyLiquidateInRecoveryMode"
  );
}

export function isRedemption(troveOperation: string): boolean {
  return troveOperation == "redeemCollateral";
}
