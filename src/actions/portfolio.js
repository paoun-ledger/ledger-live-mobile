// @flow
import { useSelector } from "react-redux";
import type {
  AccountLike,
  TokenCurrency,
  CryptoCurrency,
} from "@ledgerhq/live-common/lib/types";
import {
  useBalanceHistoryWithCountervalue as useBalanceHistoryWithCountervalueCommon,
  usePortfolio as usePortfolioCommon,
  useCurrencyPortfolio as useCurrencyPortfolioCommon,
} from "@ledgerhq/live-common/lib/portfolio/v2/react";
import type { PortfolioRange } from "@ledgerhq/live-common/lib/portfolio/v2/types";
import {
  selectedTimeRangeSelector,
  counterValueCurrencySelector,
} from "../reducers/settings";

import { activeAccountsSelector } from "../reducers/accounts";

export function useBalanceHistoryWithCountervalue({
  account,
  range,
}: {
  account: AccountLike,
  range: PortfolioRange,
}) {
  const to = useSelector(counterValueCurrencySelector);
  return useBalanceHistoryWithCountervalueCommon({ account, range, to });
}
export function usePortfolio() {
  const to = useSelector(counterValueCurrencySelector);
  const accounts = useSelector(activeAccountsSelector);
  const range = useSelector(selectedTimeRangeSelector);

  return usePortfolioCommon({ accounts, range, to });
}

export function useCurrencyPortfolio({
  currency,
  range,
}: {
  currency: CryptoCurrency | TokenCurrency,
  range: PortfolioRange,
}) {
  const accounts = useSelector(activeAccountsSelector);
  const to = useSelector(counterValueCurrencySelector);
  return useCurrencyPortfolioCommon({ accounts, range, to, currency });
}
