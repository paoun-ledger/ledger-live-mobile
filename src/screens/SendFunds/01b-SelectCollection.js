// @flow
import React, { useCallback, useMemo, useState, memo } from "react";
import isEqual from "lodash/isEqual";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useNftMetadata } from "@ledgerhq/live-common/lib/nft";
import { toNFTRaw } from "@ledgerhq/live-common/lib/account/serialization";
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from "react-native";

import type { Account } from "@ledgerhq/live-common/lib/types";
import type { CollectionWithNFT } from "@ledgerhq/live-common/lib/nft";

import LoadingFooter from "../../components/LoadingFooter";
import NftImage from "../../components/Nft/NftImage";
import Skeleton from "../../components/Skeleton";
import ChevronIcon from "../../icons/Chevron";
import LText from "../../components/LText";
import { ScreenName } from "../../const";

const MAX_COLLECTIONS_FIRST_RENDER = 8;
const COLLECTIONS_TO_ADD_ON_LIST_END_REACHED = 8;

const collectionRowIsEqual = (prevProps, nextProps) => {
  const { contract: prevContract, nfts: prevNfts } = prevProps?.collection;
  const { contract: nextContract, nfts: nextNfts } = nextProps?.collection;

  if (prevProps.account !== nextProps.account) {
    console.log("SEND COLLECTION ROW rerendered because of account", {
      account: {
        prev: prevProps.account,
        next: nextProps.account,
      },
    });
    return true;
  }

  if (prevContract !== nextContract) {
    console.log(
      "SEND COLLECTION ROW rerendered because of collection contract",
      {
        collection: {
          prev: prevContract,
          next: nextContract,
        },
      },
    );
    return true;
  }

  if (!isEqual(prevNfts?.map(toNFTRaw), nextNfts?.map(toNFTRaw))) {
    console.log(
      "SEND COLLECTION ROW rerendered because of collection nfts",
      JSON.stringify(
        {
          collection: {
            prev: prevNfts?.map(toNFTRaw),
            next: nextNfts?.map(toNFTRaw),
          },
          collectionLength: {
            prev: prevNfts?.length,
            next: nextNfts?.length,
          },
        },
        null,
        2,
      ),
    );
    return true;
  }

  return false;
};

const CollectionRow = memo(
  ({
    account,
    collection,
  }: {
    account: Account,
    collection: CollectionWithNFT,
  }) => {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const { status, metadata } = useNftMetadata(
      collection?.contract,
      collection?.nfts?.[0]?.tokenId,
    );

    const goToNftSelection = () => {
      navigation.push(ScreenName.SendNft, {
        account,
        collection,
      });
    };

    return (
      <TouchableOpacity style={styles.collectionRow} onPress={goToNftSelection}>
        <View style={styles.nftImageContainer}>
          <NftImage
            style={styles.nftImage}
            src={metadata?.media}
            status={status}
          />
        </View>
        <View style={styles.tokenNameContainer}>
          <Skeleton
            style={[styles.tokenNameSkeleton, styles.tokenName]}
            loading={status === "loading"}
          >
            <LText>{metadata?.tokenName || collection.contract}</LText>
          </Skeleton>
        </View>
        <View style={styles.chevronContainer}>
          <ChevronIcon size={11} color={colors.grey} />
        </View>
      </TouchableOpacity>
    );
  },
  collectionRowIsEqual,
);

const keyExtractor = (collection: CollectionWithNFT) => collection?.contract;

type Props = {
  route: {
    params: {
      account: Account,
      collections: CollectionWithNFT[],
    },
  },
};

const SendFundsSelectCollection = ({ route }: Props) => {
  const { params } = route;
  const { account, collections } = params;
  const { colors } = useTheme();

  const [collectionCount, setCollectionCount] = useState(
    MAX_COLLECTIONS_FIRST_RENDER,
  );
  const collectionsSlice = useMemo(
    () => collections.slice(0, collectionCount),
    [collections, collectionCount],
  );
  const onEndReached = useCallback(
    () =>
      setCollectionCount(
        collectionCount + COLLECTIONS_TO_ADD_ON_LIST_END_REACHED,
      ),
    [collectionCount, setCollectionCount],
  );

  const renderItem = useCallback(
    ({ item }: { item: CollectionWithNFT }) => (
      <CollectionRow account={account} collection={item} />
    ),
    [account],
  );

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: colors.background }]}
      forceInset={{ bottom: "always" }}
    >
      <FlatList
        contentContainerStyle={styles.collections}
        data={collectionsSlice}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
        ListFooterComponent={
          collectionCount < collections.length ? <LoadingFooter /> : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  collections: {
    paddingBottom: 32,
  },
  collectionRow: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
  },
  nftImageContainer: {
    flexGrow: 0,
    width: 48,
    ...Platform.select({
      android: {
        elevation: 1,
      },
      ios: {
        shadowOpacity: 0.15,
        shadowRadius: 4,
        shadowOffset: {
          height: 2,
        },
      },
    }),
  },
  nftImage: {
    height: 48,
    width: 48,
    borderRadius: 4,
    overflow: "hidden",
  },
  tokenNameContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  tokenNameSkeleton: {
    height: 12,
    borderRadius: 4,
  },
  tokenName: {},
  chevronContainer: {
    flexGrow: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 24,
    transform: [
      {
        rotate: "-90deg",
      },
    ],
  },
});

export default SendFundsSelectCollection;
