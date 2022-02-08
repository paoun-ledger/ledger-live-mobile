import React, { ReactNode } from "react";
import { View } from "react-native";
import { Currency, Unit } from "@ledgerhq/live-common/lib/types";
import {
  Portfolio,
  ValueChange,
} from "@ledgerhq/live-common/lib/portfolio/v2/types";
import { BoxedIcon, Flex, Text } from "@ledgerhq/native-ui";
import { Trans } from "react-i18next";
import { PieChartMedium } from "@ledgerhq/native-ui/assets/icons";
import Delta from "./Delta";
import { Item } from "./Graph/types";
import TransactionsPendingConfirmationWarning from "./TransactionsPendingConfirmationWarning";
import CurrencyUnitValue from "./CurrencyUnitValue";
import Placeholder from "./Placeholder";
import DiscreetModeButton from "./DiscreetModeButton";

type Props = {
  portfolio: Portfolio;
  counterValueCurrency: Currency;
  useCounterValue?: boolean;
  renderTitle?: ({ counterValueUnit: Unit, item: Item }) => ReactNode;
};

export default function GraphCard({
  portfolio,
  renderTitle,
  counterValueCurrency,
}: Props) {
  const { countervalueChange } = portfolio;

  const isAvailable = portfolio.balanceAvailable;
  const balanceHistory = portfolio.balanceHistory;

  return (
    <Flex bg={"neutral.c30"} p={6}>
      <GraphCardHeader
        valueChange={countervalueChange}
        isLoading={!isAvailable}
        to={balanceHistory[balanceHistory.length - 1]}
        unit={counterValueCurrency.units[0]}
        renderTitle={renderTitle}
      />
    </Flex>
  );
}

function GraphCardHeader({
  unit,
  valueChange,
  renderTitle,
  isLoading,
  to,
}: {
  isLoading: boolean;
  valueChange: ValueChange;
  unit: Unit;
  to: Item;
  renderTitle?: ({ counterValueUnit: Unit, item: Item }) => ReactNode;
}) {
  const item = to;

  return (
    <Flex
      flexDirection={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Flex>
        <Flex flexDirection={"row"} alignItems={"center"} mb={1}>
          <Text
            variant={"small"}
            fontWeight={"semiBold"}
            color={"neutral.c70"}
            textTransform={"uppercase"}
            mr={2}
          >
            Portfolio
            <Trans key={"tabs.portfolio"} />
            qsqsds
          </Text>
          <DiscreetModeButton size={20} />
        </Flex>

        <View>
          {isLoading ? (
            <Placeholder width={228} containerHeight={27} />
          ) : renderTitle ? (
            renderTitle({ counterValueUnit: unit, item })
          ) : (
            <Text variant={"h1"} color={"neutral.c100"}>
              <CurrencyUnitValue unit={unit} value={item.value} />
            </Text>
          )}
          <TransactionsPendingConfirmationWarning />
        </View>
        <Flex flexDirection={"row"}>
          {isLoading ? (
            <>
              <Placeholder
                width={50}
                containerHeight={19}
                style={{ marginRight: 10 }}
              />
              <Placeholder width={50} containerHeight={19} />
            </>
          ) : (
            <View>
              <Delta percent valueChange={valueChange} />
              <Delta valueChange={valueChange} unit={unit} />
            </View>
          )}
        </Flex>
      </Flex>
      <Flex>
        <BoxedIcon
          Icon={PieChartMedium}
          variant={"circle"}
          iconSize={20}
          size={48}
          badgeSize={30}
          iconColor={"neutral.c100"}
        />
      </Flex>
    </Flex>
  );
}
