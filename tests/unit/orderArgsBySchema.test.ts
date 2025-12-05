import { orderArgsBySchema } from "../../src/helpers/sorobanUtils";

describe("orderArgsBySchema", () => {
  describe("Basic Functionality", () => {
    it("should order flat object keys according to schema", () => {
      const schema = {
        properties: {
          name: { type: "string" },
          age: { type: "number" },
          active: { type: "boolean" },
        },
      };

      const args = {
        active: { value: "true", type: "bool" },
        name: { value: "Alice", type: "string" },
        age: { value: "25", type: "u32" },
      };

      const result = orderArgsBySchema(args, schema);
      const resultKeys = Object.keys(result);

      expect(resultKeys).toEqual(["name", "age", "active"]);
      expect(result.name).toEqual({ value: "Alice", type: "string" });
      expect(result.age).toEqual({ value: "25", type: "u32" });
      expect(result.active).toEqual({ value: "true", type: "bool" });
    });

    it("should preserve primitive values with type field", () => {
      const schema = {
        properties: {
          amount: { type: "number" },
        },
      };

      const args = {
        amount: { value: "1000", type: "u64" },
      };

      const result = orderArgsBySchema(args, schema);
      expect(result.amount).toEqual({ value: "1000", type: "u64" });
    });
  });

  describe("Nested Objects", () => {
    it("should order nested object keys recursively", () => {
      const schema = {
        properties: {
          user: {
            properties: {
              name: { type: "string" },
              email: { type: "string" },
            },
          },
          timestamp: { type: "number" },
        },
      };

      const args = {
        timestamp: { value: "123456", type: "u64" },
        user: {
          email: { value: "alice@example.com", type: "string" },
          name: { value: "Alice", type: "string" },
        },
      };

      const result = orderArgsBySchema(args, schema);
      const topLevelKeys = Object.keys(result);
      const userKeys = Object.keys(result.user);

      expect(topLevelKeys).toEqual(["user", "timestamp"]);
      expect(userKeys).toEqual(["name", "email"]);
    });

    it("should handle deeply nested objects (3+ levels)", () => {
      const schema = {
        properties: {
          config: {
            properties: {
              settings: {
                properties: {
                  theme: { type: "string" },
                  lang: { type: "string" },
                },
              },
            },
          },
        },
      };

      const args = {
        config: {
          settings: {
            lang: { value: "en", type: "string" },
            theme: { value: "dark", type: "string" },
          },
        },
      };

      const result = orderArgsBySchema(args, schema);
      const settingsKeys = Object.keys(result.config.settings);

      expect(settingsKeys).toEqual(["theme", "lang"]);
    });
  });

  describe("Arrays", () => {
    it("should preserve arrays of primitives without reordering", () => {
      const schema = {
        properties: {
          amounts: {
            type: "array",
            items: { type: "number" },
          },
        },
      };

      const args = {
        amounts: [
          { value: "100", type: "u64" },
          { value: "200", type: "u64" },
          { value: "300", type: "u64" },
        ],
      };

      const result = orderArgsBySchema(args, schema);
      expect(result.amounts).toEqual(args.amounts);
      expect(result.amounts.length).toBe(3);
    });

    it("should order objects within arrays", () => {
      const schema = {
        properties: {
          users: {
            items: {
              properties: {
                name: { type: "string" },
                age: { type: "number" },
              },
            },
          },
        },
      };

      const args = {
        users: [
          {
            age: { value: "25", type: "u32" },
            name: { value: "Alice", type: "string" },
          },
          {
            age: { value: "30", type: "u32" },
            name: { value: "Bob", type: "string" },
          },
        ],
      };

      const result = orderArgsBySchema(args, schema);
      const firstUserKeys = Object.keys(result.users[0]);
      const secondUserKeys = Object.keys(result.users[1]);

      expect(firstUserKeys).toEqual(["name", "age"]);
      expect(secondUserKeys).toEqual(["name", "age"]);
      expect(result.users[0].name).toEqual({ value: "Alice", type: "string" });
      expect(result.users[1].name).toEqual({ value: "Bob", type: "string" });
    });

    it("should not recurse on array items with tag property (enums)", () => {
      const schema = {
        properties: {
          assets: {
            items: { type: "enum" },
          },
        },
      };

      const args = {
        assets: [
          {
            tag: "Stellar",
            values: [{ value: "GABC...", type: "address" }],
          },
          {
            tag: "Other",
            values: [{ value: "some_id", type: "symbol" }],
          },
        ],
      };

      const result = orderArgsBySchema(args, schema);
      expect(result.assets).toEqual(args.assets);
      expect(result.assets[0].tag).toBe("Stellar");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty objects", () => {
      const schema = {
        properties: {
          a: {},
          b: {},
        },
      };
      const args = {};
      const result = orderArgsBySchema(args, schema);
      expect(result).toEqual({});
    });

    it("should skip keys that exist in schema but not in args", () => {
      const schema = {
        properties: {
          a: {},
          b: {},
          c: {},
        },
      };
      const args = {
        c: "value",
        a: "value",
      };
      const result = orderArgsBySchema(args, schema);
      const resultKeys = Object.keys(result);
      expect(resultKeys).toEqual(["a", "c"]);
    });

    it("should handle null values in args", () => {
      const schema = {
        properties: {
          name: { type: "string" },
          data: { type: "object" },
        },
      };
      const args = {
        data: null,
        name: { value: "test", type: "string" },
      };
      const result = orderArgsBySchema(args, schema);
      expect(result.data).toBeNull();
    });
  });

  describe("Complex Real-World Scenarios", () => {
    it("should handle complex smart contract arguments", () => {
      const schema = {
        properties: {
          admin: { type: "address" },
          base_asset: {
            properties: {
              tag: { type: "string" },
              values: { type: "array" },
            },
          },
          cache_size: { type: "number" },
          decimals: { type: "number" },
          fee_config: {
            properties: {
              tag: { type: "string" },
            },
          },
          history_retention_period: { type: "number" },
          resolution: { type: "number" },
        },
      };

      const args = {
        resolution: { value: "124", type: "u32" },
        history_retention_period: { value: "123123", type: "u64" },
        fee_config: { tag: "None" },
        decimals: { value: "100", type: "u32" },
        cache_size: { value: "100", type: "u32" },
        base_asset: {
          tag: "Stellar",
          values: [{ value: "CAQC...", type: "address" }],
        },
        admin: { value: "GBQXC...", type: "address" },
      };

      const result = orderArgsBySchema(args, schema);
      const resultKeys = Object.keys(result);

      expect(resultKeys).toEqual([
        "admin",
        "base_asset",
        "cache_size",
        "decimals",
        "fee_config",
        "history_retention_period",
        "resolution",
      ]);

      // Verify nested object isn't reordered (has .tag, treated as primitive)
      expect(result.base_asset.tag).toBe("Stellar");
      expect(result.base_asset.values).toEqual([
        { value: "CAQC...", type: "address" },
      ]);
    });

    it("should handle mixed nested objects and arrays", () => {
      const schema = {
        properties: {
          config: {
            properties: {
              admins: {
                items: {
                  properties: {
                    name: {},
                    address: {},
                  },
                },
              },
              settings: {
                properties: {
                  enabled: {},
                  threshold: {},
                },
              },
            },
          },
        },
      };

      const args = {
        config: {
          settings: {
            threshold: { value: "10", type: "u32" },
            enabled: { value: "true", type: "bool" },
          },
          admins: [
            {
              address: { value: "GABC...", type: "address" },
              name: { value: "Alice", type: "string" },
            },
          ],
        },
      };

      const result = orderArgsBySchema(args, schema);
      const configKeys = Object.keys(result.config);
      const settingsKeys = Object.keys(result.config.settings);
      const adminKeys = Object.keys(result.config.admins[0]);

      expect(configKeys).toEqual(["admins", "settings"]);
      expect(settingsKeys).toEqual(["enabled", "threshold"]);
      expect(adminKeys).toEqual(["name", "address"]);
    });
  });
});
