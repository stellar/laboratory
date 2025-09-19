import { Icon, IconButton, Link, Text } from "@stellar/design-system";
import { Box } from "@/components/layout/Box";
import { delayedAction } from "@/helpers/delayedAction";

import "./styles.scss";

export type FloatNotificationItem = {
  id: string;
  type: "success";
  title: string;
  description: string;
  actions?: {
    label: string;
    onAction: () => void;
  }[];
};

type FloatNotificationProps = {
  notifications: FloatNotificationItem[];
  onClose: (id: string) => void;
};

export const FloatNotification = ({
  notifications,
  onClose,
}: FloatNotificationProps) => {
  if (!notifications.length) {
    return null;
  }

  return (
    <div className="FloatNotification">
      {notifications.map((item) => (
        <div
          key={item.id}
          className="FloatNotification__item"
          data-id={item.id}
        >
          {/* Icon */}
          <div className="FloatNotification__item__left" data-type={item.type}>
            <Icon.CheckCircle />
          </div>

          {/* Content */}
          <div className="FloatNotification__item__content">
            <Box gap="xs">
              <Text
                as="div"
                size="sm"
                weight="semi-bold"
                addlClassName="FloatNotification__item__title"
              >
                {item.title}
              </Text>

              <Text
                as="div"
                size="sm"
                addlClassName="FloatNotification__item__description"
              >
                {item.description}
              </Text>
            </Box>

            {item.actions?.length ? (
              <Box
                gap="md"
                direction="row"
                align="center"
                addlClassName="FloatNotification__item__actions"
              >
                {item.actions.map((a, index) => (
                  <Link
                    key={`${item.id}-action-${index}`}
                    onClick={() => {
                      onClose(item.id);

                      delayedAction({
                        action: () => {
                          a.onAction();
                        },
                        delay: 100,
                      });
                    }}
                  >
                    {a.label}
                  </Link>
                ))}
              </Box>
            ) : null}
          </div>

          {/* Close button */}
          <div className="FloatNotification__item__right">
            <IconButton
              icon={<Icon.X />}
              altText="Close notification"
              onClick={() => {
                onClose(item.id);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
