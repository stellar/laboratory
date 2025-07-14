import {
  AnyObject,
  ChangeStateEntityType,
  ChangeStateItem,
  ChangeStateItemOpType,
  RpcTxJsonResponse,
} from "@/types/types";

type FormattedDataProps = {
  allItems: ChangeStateItem[];
  entityType: ChangeStateEntityType;
  itemType: ChangeStateItemOpType;
  itemData: AnyObject;
};

const getEntityTitle = (entityType: ChangeStateEntityType) => {
  let entityTitle = "";

  switch (entityType) {
    case "account":
      entityTitle = "Account";
      break;
    case "trustline":
      entityTitle = "Trustline";
      break;
    case "offer":
      entityTitle = "Offer";
      break;
    case "data":
      entityTitle = "Data";
      break;
    case "claimable_balance":
      entityTitle = "Claimable Balance";
      break;
    case "liquidity_pool":
      entityTitle = "Liquidity Pool";
      break;
    case "contract_data":
      entityTitle = "Contract Data";
      break;
    case "contract_code":
      entityTitle = "Contract Code";
      break;
    case "config_setting":
      entityTitle = "Config Setting";
      break;
    case "ttl":
      entityTitle = "TTL";
      break;
    default:
      entityTitle = entityType;
  }

  return `${entityTitle} Entity`;
};

const addBeforeDataItem = ({
  allItems,
  entityType,
  itemType,
  itemData,
}: FormattedDataProps) => {
  return [
    ...allItems,
    {
      title: getEntityTitle(entityType),
      before: {
        itemType,
        entityType,
        data: itemData,
      },
    },
  ];
};

const addAfterDataToItem = ({
  allItems,
  entityType,
  itemType,
  itemData,
}: FormattedDataProps) => {
  const lastItem = allItems[allItems.length - 1];
  const otherItems = allItems.slice(0, allItems.length - 1);

  // Make sure the entity types match
  if (lastItem.before.entityType === entityType) {
    return [
      ...otherItems,
      {
        ...lastItem,
        after: { itemType, entityType, data: itemData },
      },
    ];
  } else {
    return addBeforeDataItem({
      allItems,
      entityType,
      itemType,
      itemData,
    });
  }
};

export const formatTxChangeStateItems = (
  txDetails: RpcTxJsonResponse,
): ChangeStateItem[] | null => {
  const changes = txDetails?.resultMetaJson?.v3?.operations?.[0]?.changes;

  if (!changes?.length) {
    return null;
  }

  return changes.reduce((res: ChangeStateItem[], cur: AnyObject) => {
    const itemType = Object.keys(cur)?.[0] as ChangeStateItemOpType;

    // `removed` doesn’t have nested `data` level
    const opData = itemType === "removed" ? cur[itemType] : cur[itemType]?.data;

    const entityType = Object.keys(opData)?.[0] as ChangeStateEntityType;

    // `created` and `restored` is like adding a new state from nothing.
    // `state` is followed by either `updated` or `removed`, and shows the state
    // change.

    switch (itemType) {
      // Add new item with before state
      case "state":
      case "created":
      case "restored":
        res = addBeforeDataItem({
          allItems: res,
          entityType,
          itemType,
          itemData: opData?.[entityType],
        });

        break;
      // Update the previous item by adding after state
      case "updated":
      case "removed":
        res = addAfterDataToItem({
          allItems: res,
          entityType,
          itemType,
          itemData: opData?.[entityType],
        });

        break;
      default:
      // Do nothing
    }

    return res;
  }, [] as ChangeStateItem[]);
};
