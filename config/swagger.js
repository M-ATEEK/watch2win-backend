const config = require(".");

const apiBaseUrl = (config.API_URL || "http://localhost:8000").replace(/\/$/, "");
const authSecurity = [{ jwtAuth: [] }];

const ref = name => ({ $ref: `#/components/schemas/${name}` });

const paginatedParams = [
  {
    name: "page",
    in: "query",
    schema: { type: "integer", minimum: 1, default: 1 },
    description: "Page number."
  },
  {
    name: "limit",
    in: "query",
    schema: { type: "integer", minimum: 1, default: 10 },
    description: "Maximum number of records to return."
  }
];

const searchParam = {
  name: "search",
  in: "query",
  schema: { type: "string" },
  description: "Case-insensitive search term."
};

const allParam = {
  name: "all",
  in: "query",
  schema: { type: "boolean" },
  description: "When true, returns all records without pagination for supported endpoints."
};

const idParam = {
  name: "id",
  in: "path",
  required: true,
  schema: {
    type: "string",
    example: "6630f51d9ea2ec38190b87cd"
  },
  description: "MongoDB document identifier. Some update endpoints also accept `new` to create a record."
};

const unauthorizedResponse = {
  description: "JWT authentication failed or the Authorization header is missing.",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          message: { type: "string", example: "Unauthorized" }
        }
      }
    }
  }
};

const serverErrorResponse = {
  description: "Unexpected server error.",
  content: {
    "application/json": {
      schema: {
        type: "object",
        additionalProperties: true
      },
      example: {
        message: "Internal server error"
      }
    }
  }
};

const examples = {
  user: {
    _id: "6630f51d9ea2ec38190b87cd",
    firstName: "Ateek",
    lastName: "Khan",
    userName: "ateekkhan",
    email: "ateek@example.com",
    active: true,
    roles: ["user"],
    image: "2026-04-25T10:10:10.000Zavatar.png",
    points: 85,
    code: "AKHA-8FD2A1",
    source: "local",
    subscribeDetail: {
      subscribe: true,
      subscribeDate: "2026-04-01T08:00:00.000Z"
    },
    createdAt: "2026-04-25T10:10:10.000Z"
  },
  athlete: {
    _id: "6630f6549ea2ec38190b87d1",
    name: "Virat Kohli",
    image: "2026-04-25T10:11:00.000Zathlete.png",
    createdAt: "2026-04-25T10:11:00.000Z"
  },
  category: {
    _id: "6630f66a9ea2ec38190b87d2",
    name: "Batting",
    image: "2026-04-25T10:11:30.000Zcategory.png",
    createdAt: "2026-04-25T10:11:30.000Z"
  },
  difficulty: {
    _id: "6630f6919ea2ec38190b87d3",
    name: "Intermediate",
    points: 20,
    createdAt: "2026-04-25T10:12:00.000Z"
  },
  speedLevel: {
    _id: "6630f6a29ea2ec38190b87d4",
    name: "1.5x",
    points: 30,
    condition: 3,
    createdAt: "2026-04-25T10:12:20.000Z"
  },
  subscription: {
    _id: "6630f6b89ea2ec38190b87d5",
    name: "Gold Monthly",
    price: 19.99,
    details: "Unlimited access to premium videos for 30 days.",
    createdAt: "2026-04-25T10:12:40.000Z"
  },
  drillVideo: {
    _id: "6630f7139ea2ec38190b87d8",
    thumbnail: "cover-drill-1.png",
    video: "cover-drill-1.mp4",
    speedLevel: "6630f6a29ea2ec38190b87d4",
    duration: 90,
    totalLikes: 13,
    isPremium: false
  },
  drill: {
    _id: "6630f6f29ea2ec38190b87d7",
    name: "Cover Drive Basics",
    athlete: "6630f6549ea2ec38190b87d1",
    category: "6630f66a9ea2ec38190b87d2",
    difficultyLevel: "6630f6919ea2ec38190b87d3",
    isPremium: false,
    videos: [
      {
        _id: "6630f7139ea2ec38190b87d8",
        thumbnail: "cover-drill-1.png",
        video: "cover-drill-1.mp4",
        speedLevel: "6630f6a29ea2ec38190b87d4",
        duration: 90,
        totalLikes: 13,
        isPremium: false
      }
    ],
    createdAt: "2026-04-25T10:13:22.000Z"
  },
  language: {
    _id: "6630f7729ea2ec38190b87db",
    title: "English",
    layout_direction: "ltr",
    language_code: "en",
    is_active: true,
    is_default: true,
    createdAt: "2026-04-25T10:14:00.000Z",
    updatedAt: "2026-04-25T10:14:00.000Z"
  },
  sentence: {
    _id: "6630f7899ea2ec38190b87dc",
    key: "welcome_message",
    is_static: true,
    translations: {
      en: "Welcome to Watch2Win",
      ar: "Welcome to Watch2Win"
    },
    createdAt: "2026-04-25T10:14:30.000Z",
    updatedAt: "2026-04-25T10:14:30.000Z"
  },
  activity: {
    _id: "6630f7b09ea2ec38190b87dd",
    user_id: "6630f51d9ea2ec38190b87cd",
    type: "watch_video",
    video_id: "6630f7139ea2ec38190b87d8",
    drill_id: "6630f6f29ea2ec38190b87d7",
    createdAt: "2026-04-25T10:15:00.000Z"
  },
  earning: {
    _id: "6630f7cb9ea2ec38190b87de",
    totalEarning: 249.98
  },
  jwtToken: "JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI2NjMwZjUxZDllYTJlYzM4MTkwYjg3Y2QifQ.signature",
  mongoUpdateResult: {
    acknowledged: true,
    matchedCount: 1,
    modifiedCount: 1,
    upsertedCount: 0
  }
};

const jsonRequest = (schema, example, required = true) => ({
  required,
  content: {
    "application/json": {
      schema,
      example
    }
  }
});

const multipartRequest = (schema, example, required = true) => ({
  required,
  content: {
    "multipart/form-data": {
      schema,
      example
    }
  }
});

const jsonResponse = (description, schema, example) => ({
  description,
  content: {
    "application/json": {
      schema,
      example
    }
  }
});

const buildCrudPaths = ({
  tag,
  basePath,
  singleName,
  listKey = singleName,
  listName,
  singleSchemaName,
  createRequestSchema,
  updateRequestSchema,
  createConsumes = "application/json",
  listParams = [],
  includeCount = true,
  listExample,
  singleExample,
  updateResultKey
}) => {
  const createRequest =
    createConsumes === "multipart/form-data"
      ? multipartRequest(ref(createRequestSchema), undefined)
      : jsonRequest(ref(createRequestSchema), undefined);

  const updateRequest =
    createConsumes === "multipart/form-data"
      ? multipartRequest(ref(updateRequestSchema || createRequestSchema), undefined)
      : jsonRequest(ref(updateRequestSchema || createRequestSchema), undefined);

  return {
    [basePath]: {
      get: {
        tags: [tag],
        security: authSecurity,
        summary: `List ${listName}`,
        parameters: listParams,
        responses: {
          200: jsonResponse(
            `${listName} response`,
            {
              type: "object",
              properties: {
                ...(includeCount ? { count: { type: "integer" } } : {}),
                message: { type: "string" },
                data: {
                  type: "object",
                  properties: {
                    [listKey]: {
                      type: "array",
                      items: ref(singleSchemaName)
                    }
                  }
                }
              }
            },
            listExample
          ),
          401: unauthorizedResponse,
          500: serverErrorResponse
        }
      },
      post: {
        tags: [tag],
        security: authSecurity,
        summary: `Create ${singleName}`,
        requestBody: createRequest,
        responses: {
          200: jsonResponse(
            `${singleName} create response`,
            {
              type: "object",
              properties: {
                success: { type: "boolean" },
                data: {
                  type: "object",
                  properties: {
                    [singleName]: ref(singleSchemaName),
                    message: { type: "string" }
                  }
                }
              }
            },
            {
              success: true,
              data: {
                [singleName]: singleExample,
                message: `${singleName} saved successfully`
              }
            }
          ),
          401: unauthorizedResponse,
          500: serverErrorResponse
        }
      }
    },
    [`${basePath}/{id}`]: {
      get: {
        tags: [tag],
        security: authSecurity,
        summary: `Get ${singleName} by id`,
        parameters: [idParam],
        responses: {
          200: jsonResponse(
            `${singleName} response`,
            {
              type: "object",
              properties: {
                message: { type: "string" },
                data: {
                  type: "object",
                  properties: {
                    [singleName]: ref(singleSchemaName)
                  }
                }
              }
            },
            {
              message: "success.",
              data: {
                [singleName]: singleExample
              }
            }
          ),
          401: unauthorizedResponse,
          500: serverErrorResponse
        }
      },
      post: {
        tags: [tag],
        security: authSecurity,
        summary: `Create or update ${singleName}`,
        description:
          "The backend uses `POST` with a path parameter instead of `PUT/PATCH`. Use `id=new` to create via upsert when supported.",
        parameters: [idParam],
        requestBody: updateRequest,
        responses: {
          200: jsonResponse(
            `${singleName} update response`,
            {
              type: "object",
              properties: {
                message: { type: "string" },
                data: {
                  type: "object",
                  properties: {
                    [updateResultKey || singleName]: {
                      anyOf: [ref(singleSchemaName), ref("MongoUpdateResult")]
                    }
                  }
                }
              }
            },
            {
              message: "success.",
              data: {
                [updateResultKey || singleName]: examples.mongoUpdateResult
              }
            }
          ),
          401: unauthorizedResponse,
          500: serverErrorResponse
        }
      },
      delete: {
        tags: [tag],
        security: authSecurity,
        summary: `Delete ${singleName}`,
        parameters: [idParam],
        responses: {
          200: jsonResponse(
            `${singleName} delete response`,
            {
              type: "object",
              properties: {
                message: { type: "string" },
                data: {
                  type: "object",
                  properties: {
                    count: { type: "integer" },
                    [singleName]: ref(singleSchemaName)
                  }
                }
              }
            },
            {
              message: "success.",
              data: {
                count: 9,
                [singleName]: singleExample
              }
            }
          ),
          401: unauthorizedResponse,
          500: serverErrorResponse
        }
      }
    }
  };
};

const paths = {
  "/users": {
    get: {
      tags: ["Users"],
      security: authSecurity,
      summary: "List users",
      parameters: [
        ...paginatedParams,
        {
          name: "role",
          in: "query",
          schema: { type: "string" },
          description: "Filter by user role."
        },
        {
          name: "position",
          in: "query",
          schema: {
            type: "string",
            enum: ["business", "landlord", "tenant", "all"]
          }
        },
        {
          name: "name",
          in: "query",
          schema: { type: "string" },
          description: "Prefix match on first name."
        },
        {
          name: "city",
          in: "query",
          schema: { type: "string" }
        },
        {
          name: "sortBy",
          in: "query",
          schema: {
            type: "string",
            enum: ["A-Z", "Z-A", "asc", "dsc", "all"]
          }
        }
      ],
      responses: {
        200: jsonResponse(
          "User list response",
          {
            type: "object",
            properties: {
              success: { type: "boolean" },
              total: { type: "integer" },
              page: { type: "integer" },
              data: {
                type: "object",
                properties: {
                  users: {
                    type: "array",
                    items: ref("User")
                  }
                }
              }
            }
          },
          {
            success: true,
            total: 1,
            page: 1,
            data: {
              users: [examples.user]
            }
          }
        ),
        401: unauthorizedResponse,
        500: serverErrorResponse
      }
    }
  },
  "/user": {
    get: {
      tags: ["Users"],
      security: authSecurity,
      summary: "Get the current authenticated user's compact profile",
      responses: {
        200: jsonResponse(
          "Current user response",
          {
            type: "object",
            properties: {
              message: { type: "string" },
              data: {
                type: "object",
                properties: {
                  user: ref("CurrentUserProfile")
                }
              }
            }
          },
          {
            message: "User fetched",
            data: {
              user: {
                companyName: "Watch2Win",
                createdAt: examples.user.createdAt,
                email: examples.user.email,
                firstName: examples.user.firstName,
                lastName: examples.user.lastName,
                mobileNumber: "123456789",
                position: "tenant",
                roles: examples.user.roles
              }
            }
          }
        ),
        401: unauthorizedResponse
      }
    }
  },
  "/me": {
    get: {
      tags: ["Users"],
      security: authSecurity,
      summary: "Get the authenticated user object",
      responses: {
        200: jsonResponse(
          "Authenticated user response",
          {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "object",
                properties: {
                  user: ref("User")
                }
              }
            }
          },
          {
            success: true,
            data: {
              user: examples.user
            }
          }
        ),
        401: unauthorizedResponse
      }
    }
  },
  "/update-users/{id}": {
    put: {
      tags: ["Users"],
      security: authSecurity,
      summary: "Update a user's profile and status fields",
      parameters: [idParam],
      requestBody: multipartRequest(ref("UpdateUserRequest")),
      responses: {
        200: jsonResponse(
          "User update response",
          {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "object",
                properties: {
                  user: ref("User")
                }
              }
            }
          },
          {
            success: true,
            data: {
              user: {
                ...examples.user,
                active: false,
                points: 120
              }
            }
          }
        ),
        400: jsonResponse(
          "Validation response",
          {
            type: "object",
            properties: {
              data: {
                type: "object",
                properties: {
                  user: { type: "object" }
                }
              },
              message: { type: "string" }
            }
          },
          {
            data: { user: {} },
            message: "Validation failed"
          }
        ),
        401: unauthorizedResponse
      }
    }
  },
  "/admin/users": {
    get: {
      tags: ["Admin Users"],
      security: authSecurity,
      summary: "List platform users for the admin panel",
      parameters: [...paginatedParams, searchParam],
      responses: {
        200: jsonResponse(
          "Admin users list response",
          {
            type: "object",
            properties: {
              count: { type: "integer" },
              message: { type: "string" },
              data: {
                type: "object",
                properties: {
                  user: {
                    type: "array",
                    items: ref("User")
                  }
                }
              }
            }
          },
          {
            count: 1,
            message: "users fetched successfully",
            data: {
              user: [examples.user]
            }
          }
        ),
        401: unauthorizedResponse,
        500: serverErrorResponse
      }
    }
  },
  "/admin/users/{id}": {
    get: {
      tags: ["Admin Users"],
      security: authSecurity,
      summary: "Get one user for admin management",
      parameters: [idParam],
      responses: {
        200: jsonResponse(
          "Admin user response",
          {
            type: "object",
            properties: {
              message: { type: "string" },
              data: {
                type: "object",
                properties: {
                  user: ref("User")
                }
              }
            }
          },
          {
            message: "success.",
            data: {
              user: examples.user
            }
          }
        ),
        401: unauthorizedResponse,
        500: serverErrorResponse
      }
    },
    post: {
      tags: ["Admin Users"],
      security: authSecurity,
      summary: "Create or update a user record from the admin panel",
      parameters: [idParam],
      requestBody: multipartRequest(ref("AdminUserUpsertRequest")),
      responses: {
        200: jsonResponse(
          "Admin user upsert response",
          {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "object",
                properties: {
                  user: {
                    anyOf: [ref("User"), ref("MongoUpdateResult")]
                  }
                }
              }
            }
          },
          {
            success: true,
            data: {
              user: examples.mongoUpdateResult
            }
          }
        ),
        401: unauthorizedResponse,
        500: serverErrorResponse
      }
    },
    delete: {
      tags: ["Admin Users"],
      security: authSecurity,
      summary: "Delete a user from the admin panel",
      parameters: [idParam],
      responses: {
        200: jsonResponse(
          "User delete response",
          {
            type: "object",
            properties: {
              message: { type: "string" },
              data: {
                type: "object",
                properties: {
                  count: { type: "integer" },
                  user: ref("User")
                }
              }
            }
          },
          {
            message: "success.",
            data: {
              count: 4,
              user: examples.user
            }
          }
        ),
        401: unauthorizedResponse,
        500: serverErrorResponse
      }
    }
  },
  "/user/favoriteVideo": {
    post: {
      tags: ["Users"],
      security: authSecurity,
      summary: "Add or remove a video from favourites",
      requestBody: jsonRequest(ref("VideoToggleRequest"), {
        isAdded: true,
        video_id: "6630f7139ea2ec38190b87d8",
        drill_id: "6630f6f29ea2ec38190b87d7"
      }),
      responses: {
        200: jsonResponse(
          "Favourite mutation response",
          {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "object",
                properties: {
                  drills: { type: "object", additionalProperties: true },
                  message: { type: "string" }
                }
              }
            }
          },
          {
            success: true,
            data: {
              drills: {
                acknowledged: true,
                modifiedCount: 1
              },
              message: "video added to favorite"
            }
          }
        ),
        401: unauthorizedResponse
      }
    }
  },
  "/user/watchLater": {
    post: {
      tags: ["Users"],
      security: authSecurity,
      summary: "Add or remove a video from watch later",
      requestBody: jsonRequest(ref("VideoToggleRequest"), {
        isAdded: true,
        video_id: "6630f7139ea2ec38190b87d8",
        drill_id: "6630f6f29ea2ec38190b87d7"
      }),
      responses: {
        200: jsonResponse(
          "Watch later mutation response",
          {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "object",
                properties: {
                  drills: { type: "object", additionalProperties: true },
                  message: { type: "string" }
                }
              }
            }
          },
          {
            success: true,
            data: {
              drills: {
                acknowledged: true,
                modifiedCount: 1
              },
              message: "video added to watch later"
            }
          }
        ),
        401: unauthorizedResponse
      }
    }
  },
  "/user/followUser": {
    post: {
      tags: ["Users"],
      security: authSecurity,
      summary: "Follow or unfollow another user",
      requestBody: jsonRequest(ref("FollowUserRequest"), {
        isAdded: true,
        following: "6630f51d9ea2ec38190b87cd"
      }),
      responses: {
        200: jsonResponse(
          "Follow mutation response",
          {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "object",
                properties: {
                  drills: { type: "object", additionalProperties: true },
                  message: { type: "string" }
                }
              }
            }
          },
          {
            success: true,
            data: {
              drills: {
                acknowledged: true,
                modifiedCount: 1
              },
              message: "follow user added"
            }
          }
        ),
        401: unauthorizedResponse
      }
    }
  },
  "/user/search": {
    get: {
      tags: ["Users"],
      security: authSecurity,
      summary: "Search users, categories, and athletes by keyword",
      parameters: [
        {
          name: "keyword",
          in: "query",
          required: true,
          schema: { type: "string" }
        }
      ],
      responses: {
        200: jsonResponse(
          "Search response",
          {
            type: "object",
            properties: {
              data: {
                type: "object",
                properties: {
                  users: { type: "array", items: ref("User") },
                  categories: { type: "array", items: ref("Category") },
                  athlete: { type: "array", items: ref("Athlete") }
                }
              }
            }
          },
          {
            data: {
              users: [examples.user],
              categories: [examples.category],
              athlete: [examples.athlete]
            }
          }
        ),
        401: unauthorizedResponse
      }
    }
  },
  "/user/detail": {
    get: {
      tags: ["Users"],
      security: authSecurity,
      summary: "Get a detailed user profile with activities and relations",
      responses: {
        200: jsonResponse(
          "Detailed user response",
          {
            type: "object",
            properties: {
              data: {
                type: "object",
                properties: {
                  user: {
                    type: "array",
                    items: ref("User")
                  },
                  activity: {
                    type: "array",
                    items: ref("Activity")
                  }
                }
              }
            }
          },
          {
            data: {
              user: [examples.user],
              activity: [examples.activity]
            }
          }
        ),
        401: unauthorizedResponse
      }
    }
  },
  "/loginUser": {
    get: {
      tags: ["Users"],
      security: authSecurity,
      summary: "Return the authenticated user object",
      responses: {
        200: jsonResponse(
          "Logged-in user response",
          {
            type: "object",
            properties: {
              loginUser: ref("User")
            }
          },
          {
            loginUser: examples.user
          }
        ),
        401: unauthorizedResponse
      }
    }
  },
  "/checkoutNew": {
    get: {
      tags: ["Payments"],
      summary: "Generate a Braintree client token",
      responses: {
        200: jsonResponse(
          "Braintree token response",
          {
            type: "object",
            properties: {
              token: { type: "string" }
            }
          },
          {
            token: "sandbox_client_token_example"
          }
        ),
        500: serverErrorResponse
      }
    }
  },
  "/checkout": {
    post: {
      tags: ["Payments"],
      security: authSecurity,
      summary: "Charge a subscription purchase",
      requestBody: jsonRequest(ref("CheckoutRequest"), {
        sub_id: "6630f6b89ea2ec38190b87d5",
        data: {
          nonce: "fake-valid-nonce",
          detail: "device-data"
        }
      }),
      responses: {
        200: jsonResponse(
          "Checkout response",
          {
            type: "object",
            properties: {
              message: {
                oneOf: [{ type: "boolean" }, { type: "string" }]
              },
              result: {
                type: "object",
                additionalProperties: true
              }
            }
          },
          {
            message: true,
            result: {
              success: true,
              transaction: {
                id: "the_transaction_id",
                amount: "19.99"
              }
            }
          }
        ),
        401: unauthorizedResponse,
        500: serverErrorResponse
      }
    }
  },
  "/admin/subscriberbymonth": {
    get: {
      tags: ["Payments"],
      security: authSecurity,
      summary: "Get monthly subscriber totals",
      responses: {
        200: jsonResponse(
          "Monthly subscriber counts",
          {
            type: "object",
            properties: {
              jan: { type: "integer" },
              feb: { type: "integer" },
              mar: { type: "integer" },
              apr: { type: "integer" },
              may: { type: "integer" },
              jun: { type: "integer" },
              jul: { type: "integer" },
              aug: { type: "integer" },
              sep: { type: "integer" },
              oct: { type: "integer" },
              nov: { type: "integer" },
              dec: { type: "integer" }
            }
          },
          {
            jan: 3,
            feb: 5,
            mar: 6,
            apr: 4,
            may: 8,
            jun: 7,
            jul: 9,
            aug: 10,
            sep: 6,
            oct: 11,
            nov: 7,
            dec: 12
          }
        ),
        401: unauthorizedResponse
      }
    }
  },
  "/admin/totalsubscriber": {
    get: {
      tags: ["Payments"],
      security: authSecurity,
      summary: "Get the total subscriber count",
      responses: {
        200: jsonResponse(
          "Total subscriber response",
          {
            type: "object",
            properties: {
              totalsubscribers: { type: "integer" }
            }
          },
          {
            totalsubscribers: 42
          }
        ),
        401: unauthorizedResponse
      }
    }
  },
  "/admin/drills": {
    get: {
      tags: ["Drills"],
      security: authSecurity,
      summary: "List drills with optional filters",
      parameters: [
        ...paginatedParams,
        {
          name: "drillsName",
          in: "query",
          schema: { type: "string" }
        },
        {
          name: "category_id",
          in: "query",
          schema: { type: "string" }
        },
        {
          name: "athlete_id",
          in: "query",
          schema: { type: "string" }
        },
        {
          name: "categoryName",
          in: "query",
          schema: { type: "string" }
        },
        {
          name: "athleteName",
          in: "query",
          schema: { type: "string" }
        }
      ],
      responses: {
        200: jsonResponse(
          "Drills list response",
          {
            type: "object",
            properties: {
              count: { type: "integer" },
              message: { type: "string" },
              data: {
                type: "object",
                properties: {
                  drills: {
                    type: "array",
                    items: ref("Drill")
                  }
                }
              }
            }
          },
          {
            count: 1,
            message: "drills fetched successfully",
            data: {
              drills: [examples.drill]
            }
          }
        ),
        401: unauthorizedResponse,
        500: serverErrorResponse
      }
    },
    post: {
      tags: ["Drills"],
      security: authSecurity,
      summary: "Create a drill",
      requestBody: jsonRequest(ref("DrillUpsertRequest"), {
        name: "Cover Drive Basics",
        athlete: "6630f6549ea2ec38190b87d1",
        category: "6630f66a9ea2ec38190b87d2",
        difficultyLevel: "6630f6919ea2ec38190b87d3",
        isPremium: false,
        videos: [examples.drillVideo]
      }),
      responses: {
        200: jsonResponse(
          "Drill create response",
          {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "object",
                properties: {
                  drills: ref("Drill"),
                  message: { type: "string" }
                }
              }
            }
          },
          {
            success: true,
            data: {
              drills: examples.drill,
              message: "drill saved successfully"
            }
          }
        ),
        401: unauthorizedResponse,
        500: serverErrorResponse
      }
    }
  },
  "/admin/drills/upload": {
    post: {
      tags: ["Drills"],
      security: authSecurity,
      summary: "Upload drill media files",
      requestBody: multipartRequest(ref("DrillUploadRequest")),
      responses: {
        200: jsonResponse(
          "Upload response",
          {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "object",
                properties: {
                  videos: {
                    type: "object",
                    properties: {
                      thumbnail: { type: "string" },
                      video: { type: "string" }
                    }
                  },
                  message: { type: "string" }
                }
              }
            }
          },
          {
            success: true,
            data: {
              videos: {
                thumbnail: "cover-drive-thumb.png",
                video: "cover-drive.mp4"
              },
              message: "video and thumbnails name!"
            }
          }
        ),
        401: unauthorizedResponse
      }
    }
  },
  "/admin/drills/{id}": {
    get: {
      tags: ["Drills"],
      security: authSecurity,
      summary: "Get a drill by id",
      parameters: [idParam],
      responses: {
        200: jsonResponse(
          "Drill response",
          {
            type: "object",
            properties: {
              message: { type: "string" },
              data: {
                type: "object",
                properties: {
                  drills: {
                    type: "array",
                    items: ref("Drill")
                  }
                }
              }
            }
          },
          {
            message: "success.",
            data: {
              drills: [examples.drill]
            }
          }
        ),
        401: unauthorizedResponse,
        500: serverErrorResponse
      }
    },
    post: {
      tags: ["Drills"],
      security: authSecurity,
      summary: "Create or update a drill via upsert",
      parameters: [idParam],
      requestBody: jsonRequest(ref("DrillUpsertRequest"), {
        name: "Cover Drive Basics",
        athlete: "6630f6549ea2ec38190b87d1",
        category: "6630f66a9ea2ec38190b87d2",
        speedLevel: "6630f6a29ea2ec38190b87d4",
        thumbnail: "cover-drive-thumb.png",
        difficultyLevel: "6630f6919ea2ec38190b87d3",
        isPremium: false,
        videos: [examples.drillVideo],
        deletedfiles: ["old-video.mp4"]
      }),
      responses: {
        200: jsonResponse(
          "Drill upsert response",
          {
            type: "object",
            properties: {
              message: { type: "string" },
              data: {
                type: "object",
                properties: {
                  drills: ref("MongoUpdateResult")
                }
              }
            }
          },
          {
            message: "success.",
            data: {
              drills: examples.mongoUpdateResult
            }
          }
        ),
        401: unauthorizedResponse,
        500: serverErrorResponse
      }
    },
    delete: {
      tags: ["Drills"],
      security: authSecurity,
      summary: "Delete a drill and its media files",
      parameters: [idParam],
      responses: {
        200: jsonResponse(
          "Drill delete response",
          {
            type: "object",
            properties: {
              message: { type: "string" },
              data: {
                type: "object",
                properties: {
                  count: { type: "integer" },
                  drills: ref("Drill")
                }
              }
            }
          },
          {
            message: "success.",
            data: {
              count: 5,
              drills: examples.drill
            }
          }
        ),
        401: unauthorizedResponse,
        500: serverErrorResponse
      }
    }
  },
  "/user/points": {
    post: {
      tags: ["Drills"],
      security: authSecurity,
      summary: "Record watched video progress and reward points",
      requestBody: jsonRequest(ref("PointsRequest"), {
        watchedVideos: [
          {
            drill_id: "6630f6f29ea2ec38190b87d7",
            diffculty_id: "6630f6919ea2ec38190b87d3",
            speed_level_id: "6630f6a29ea2ec38190b87d4",
            video_id: "6630f7139ea2ec38190b87d8",
            watch_count: 1
          }
        ]
      }),
      responses: {
        200: jsonResponse(
          "Points response",
          {
            type: "object",
            additionalProperties: true
          },
          {
            success: true,
            data: {
              watchedVideos: {
                acknowledged: true,
                modifiedCount: 1
              },
              message: "count increse"
            }
          }
        ),
        401: unauthorizedResponse,
        500: serverErrorResponse
      }
    }
  },
  "/totallikes": {
    post: {
      tags: ["Drills"],
      security: authSecurity,
      summary: "Increment or decrement likes for a drill video",
      requestBody: jsonRequest(ref("TotalLikesRequest"), {
        drill_id: "6630f6f29ea2ec38190b87d7",
        video_id: "6630f7139ea2ec38190b87d8",
        isLike: true
      }),
      responses: {
        200: jsonResponse(
          "Like mutation response",
          {
            type: "object",
            properties: {
              videoLikes: {
                type: "object",
                additionalProperties: true
              }
            }
          },
          {
            videoLikes: {
              acknowledged: true,
              modifiedCount: 1
            }
          }
        ),
        401: unauthorizedResponse,
        500: serverErrorResponse
      }
    }
  },
  "/admin/activity": {
    get: {
      tags: ["Activity"],
      security: authSecurity,
      summary: "List activity records for the authenticated user",
      parameters: paginatedParams,
      responses: {
        200: jsonResponse(
          "Activity list response",
          {
            type: "object",
            properties: {
              message: { type: "string" },
              data: {
                type: "object",
                properties: {
                  activity: {
                    type: "array",
                    items: ref("Activity")
                  }
                }
              }
            }
          },
          {
            message: "Activities",
            data: {
              activity: [examples.activity]
            }
          }
        ),
        401: unauthorizedResponse
      }
    },
    post: {
      tags: ["Activity"],
      security: authSecurity,
      summary: "Create an activity record",
      requestBody: jsonRequest(ref("ActivityRequest"), {
        type: "watch_video",
        video_id: "6630f7139ea2ec38190b87d8",
        drill_id: "6630f6f29ea2ec38190b87d7"
      }),
      responses: {
        200: jsonResponse(
          "Activity create response",
          {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "object",
                properties: {
                  activity: ref("Activity"),
                  message: { type: "string" }
                }
              }
            }
          },
          {
            success: true,
            data: {
              activity: examples.activity,
              message: "activity saved successfully!"
            }
          }
        ),
        401: unauthorizedResponse
      }
    }
  },
  "/admin/activity/{id}": {
    get: {
      tags: ["Activity"],
      security: authSecurity,
      summary: "List activity records for a specific user id",
      parameters: [idParam],
      responses: {
        200: jsonResponse(
          "User activity response",
          {
            type: "object",
            properties: {
              activity: {
                type: "array",
                items: ref("Activity")
              }
            }
          },
          {
            activity: [examples.activity]
          }
        ),
        401: unauthorizedResponse
      }
    }
  },
  "/admin/earning": {
    get: {
      tags: ["Earnings"],
      security: authSecurity,
      summary: "Get total platform earnings",
      responses: {
        200: jsonResponse(
          "Earnings response",
          {
            type: "object",
            properties: {
              totalEarning: {
                type: "array",
                items: ref("Earning")
              }
            }
          },
          {
            totalEarning: [examples.earning]
          }
        ),
        401: unauthorizedResponse
      }
    }
  },
  ...buildCrudPaths({
    tag: "Categories",
    basePath: "/admin/categories",
    singleName: "category",
    listName: "categories",
    singleSchemaName: "Category",
    createRequestSchema: "CategoryUpsertRequest",
    createConsumes: "multipart/form-data",
    listParams: [...paginatedParams, searchParam, allParam],
    listExample: {
      count: 1,
      message: "categories fetched successfully",
      data: {
        category: [examples.category]
      }
    },
    singleExample: examples.category
  }),
  ...buildCrudPaths({
    tag: "Athletes",
    basePath: "/admin/athlete",
    singleName: "athlete",
    listName: "athletes",
    singleSchemaName: "Athlete",
    createRequestSchema: "AthleteUpsertRequest",
    createConsumes: "multipart/form-data",
    listParams: [...paginatedParams, searchParam, allParam],
    listExample: {
      count: 1,
      message: "athlete fetched successfully",
      data: {
        athlete: [examples.athlete]
      }
    },
    singleExample: examples.athlete
  }),
  ...buildCrudPaths({
    tag: "Difficulty Levels",
    basePath: "/admin/difficulty",
    singleName: "difficulty",
    listName: "difficulty levels",
    singleSchemaName: "DifficultyLevel",
    createRequestSchema: "DifficultyLevelRequest",
    listParams: [...paginatedParams, searchParam, allParam],
    listExample: {
      count: 1,
      message: "fetched successfully",
      data: {
        difficulty: [examples.difficulty]
      }
    },
    singleExample: examples.difficulty
  }),
  ...buildCrudPaths({
    tag: "Speed Levels",
    basePath: "/admin/speed",
    singleName: "speedLevel",
    listName: "speed levels",
    singleSchemaName: "SpeedLevel",
    createRequestSchema: "SpeedLevelRequest",
    listParams: [...paginatedParams, searchParam, allParam],
    listExample: {
      count: 1,
      message: "fetched successfully",
      data: {
        speedLevel: [examples.speedLevel]
      }
    },
    singleExample: examples.speedLevel
  }),
  ...buildCrudPaths({
    tag: "Subscriptions",
    basePath: "/admin/subscription",
    singleName: "subscriptions",
    listName: "subscriptions",
    singleSchemaName: "Subscription",
    createRequestSchema: "SubscriptionRequest",
    listParams: [searchParam],
    includeCount: false,
    listExample: {
      message: "fetched successfully",
      data: {
        subscriptions: [examples.subscription]
      }
    },
    singleExample: examples.subscription
  }),
  ...buildCrudPaths({
    tag: "Localization",
    basePath: "/admin/languages",
    singleName: "language",
    listKey: "languages",
    listName: "languages",
    singleSchemaName: "Language",
    createRequestSchema: "LanguageRequest",
    listParams: [],
    includeCount: false,
    listExample: {
      message: "languages fetched successfully",
      data: {
        languages: [examples.language]
      }
    },
    singleExample: examples.language
  }),
  ...buildCrudPaths({
    tag: "Localization",
    basePath: "/admin/sentences",
    singleName: "sentence",
    listKey: "sentences",
    listName: "sentences",
    singleSchemaName: "Sentence",
    createRequestSchema: "SentenceRequest",
    listParams: [],
    includeCount: false,
    listExample: {
      message: "sentences fetched successfully",
      data: {
        sentences: [examples.sentence]
      }
    },
    singleExample: examples.sentence
  })
};

module.exports = {
  openapi: "3.0.3",
  info: {
    title: "Watch2Win Backend API",
    version: "1.0.0",
    description:
      "Swagger documentation for the Watch2Win backend service. All protected routes require the `Authorization` header in the form `JWT <token>`."
  },
  servers: [
    {
      url: `${apiBaseUrl}/api/v1`,
      description: "Configured backend API base URL"
    }
  ],
  tags: [
    { name: "Users", description: "Authenticated user profile, search, and social interaction endpoints." },
    { name: "Admin Users", description: "Administrative user management endpoints." },
    { name: "Categories", description: "Category management endpoints." },
    { name: "Athletes", description: "Athlete management endpoints." },
    { name: "Drills", description: "Drill content management and reward point endpoints." },
    { name: "Difficulty Levels", description: "Difficulty level configuration endpoints." },
    { name: "Speed Levels", description: "Video speed level configuration endpoints." },
    { name: "Subscriptions", description: "Subscription plan management endpoints." },
    { name: "Localization", description: "Language and sentence content management endpoints." },
    { name: "Activity", description: "Activity feed endpoints." },
    { name: "Payments", description: "Subscription checkout and reporting endpoints." },
    { name: "Earnings", description: "Platform earnings endpoint." }
  ],
  components: {
    securitySchemes: {
      jwtAuth: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
        description: "Provide the token exactly as returned by the backend, for example `JWT eyJ...`."
      }
    },
    schemas: {
      MongoUpdateResult: {
        type: "object",
        properties: {
          acknowledged: { type: "boolean" },
          matchedCount: { type: "integer" },
          modifiedCount: { type: "integer" },
          upsertedCount: { type: "integer" }
        }
      },
      User: {
        type: "object",
        properties: {
          _id: { type: "string" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          userName: { type: "string" },
          email: { type: "string", format: "email" },
          active: { type: "boolean" },
          roles: {
            type: "array",
            items: { type: "string", enum: ["admin", "user"] }
          },
          image: { type: "string", nullable: true },
          points: { type: "number" },
          code: { type: "string" },
          source: {
            type: "string",
            enum: ["google", "local", "facebook"],
            nullable: true
          },
          subscribeDetail: {
            type: "object",
            properties: {
              subscribe: { type: "boolean" },
              subscribeDate: { type: "string", format: "date-time", nullable: true }
            }
          },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      CurrentUserProfile: {
        type: "object",
        properties: {
          companyName: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          email: { type: "string", format: "email" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          mobileNumber: { type: "string", nullable: true },
          position: { type: "string", nullable: true },
          roles: {
            type: "array",
            items: { type: "string" }
          }
        }
      },
      Athlete: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          image: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      Category: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          image: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      DifficultyLevel: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          points: { type: "number" },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      SpeedLevel: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          points: { type: "number" },
          condition: { type: "number" },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      Subscription: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          price: { type: "number" },
          details: { type: "string" },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      DrillVideo: {
        type: "object",
        properties: {
          _id: { type: "string" },
          thumbnail: { type: "string" },
          video: { type: "string" },
          speedLevel: {
            oneOf: [{ type: "string" }, ref("SpeedLevel")]
          },
          duration: { type: "number" },
          totalLikes: { type: "number" },
          isPremium: { type: "boolean" }
        }
      },
      Drill: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          thumbnail: { type: "string", nullable: true },
          athlete: {
            oneOf: [{ type: "string" }, ref("Athlete")]
          },
          category: {
            oneOf: [{ type: "string" }, ref("Category")]
          },
          difficultyLevel: {
            oneOf: [{ type: "string" }, ref("DifficultyLevel")]
          },
          videos: {
            type: "array",
            items: ref("DrillVideo")
          },
          isPremium: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      Language: {
        type: "object",
        properties: {
          _id: { type: "string" },
          title: { type: "string" },
          layout_direction: { type: "string", enum: ["ltr", "rtl"] },
          language_code: { type: "string" },
          is_active: { type: "boolean" },
          is_default: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      Sentence: {
        type: "object",
        properties: {
          _id: { type: "string" },
          key: { type: "string" },
          is_static: { type: "boolean" },
          translations: {
            type: "object",
            additionalProperties: { type: "string" }
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      Activity: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user_id: { type: "string" },
          type: { type: "string" },
          video_id: { type: "string", nullable: true },
          drill_id: {
            oneOf: [{ type: "string" }, ref("Drill")]
          },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      Earning: {
        type: "object",
        properties: {
          _id: { type: "string" },
          totalEarning: { type: "number" }
        }
      },
      UpdateUserRequest: {
        type: "object",
        required: ["user"],
        properties: {
          user: {
            type: "string",
            description: "JSON-stringified user object expected by the current backend implementation.",
            example:
              "{\"firstName\":\"Ateek\",\"lastName\":\"Khan\",\"roles\":[\"user\"],\"companyName\":\"Watch2Win\",\"mobileNumber\":\"123456789\",\"active\":true,\"userType\":\"viewer\",\"position\":\"tenant\",\"city\":\"Helsinki\",\"fields\":[]}"
          },
          image: { type: "string", format: "binary" }
        }
      },
      AdminUserUpsertRequest: {
        type: "object",
        required: ["firstName", "lastName", "email", "password", "confirm_password"],
        properties: {
          firstName: { type: "string" },
          lastName: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string" },
          confirm_password: { type: "string" },
          userName: { type: "string" },
          roles: {
            type: "array",
            items: { type: "string" }
          },
          image: { type: "string", format: "binary" }
        }
      },
      AthleteUpsertRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          image: { type: "string", format: "binary" }
        }
      },
      CategoryUpsertRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          image: { type: "string", format: "binary" }
        }
      },
      DifficultyLevelRequest: {
        type: "object",
        required: ["name", "points"],
        properties: {
          name: { type: "string" },
          points: { type: "number" }
        }
      },
      SpeedLevelRequest: {
        type: "object",
        required: ["name", "points", "condition"],
        properties: {
          name: { type: "string" },
          points: { type: "number" },
          condition: { type: "number" }
        }
      },
      SubscriptionRequest: {
        type: "object",
        required: ["name", "price", "details"],
        properties: {
          name: { type: "string" },
          price: { type: "number" },
          details: { type: "string" }
        }
      },
      LanguageRequest: {
        type: "object",
        required: ["title", "layout_direction", "language_code", "is_active", "is_default"],
        properties: {
          title: { type: "string" },
          layout_direction: { type: "string", enum: ["ltr", "rtl"] },
          language_code: { type: "string" },
          is_active: { type: "boolean" },
          is_default: { type: "boolean" }
        }
      },
      SentenceRequest: {
        type: "object",
        required: ["key", "is_static", "translations"],
        properties: {
          key: { type: "string" },
          is_static: { type: "boolean" },
          translations: {
            type: "object",
            additionalProperties: { type: "string" }
          }
        }
      },
      DrillUpsertRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          athlete: { type: "string" },
          category: { type: "string" },
          speedLevel: { type: "string" },
          thumbnail: { type: "string" },
          difficultyLevel: { type: "string" },
          isPremium: { type: "boolean" },
          videos: {
            type: "array",
            items: ref("DrillVideo")
          },
          deletedfiles: {
            type: "array",
            items: { type: "string" }
          }
        }
      },
      DrillUploadRequest: {
        type: "object",
        properties: {
          thumbnail: {
            type: "array",
            items: { type: "string", format: "binary" }
          },
          video: {
            type: "array",
            items: { type: "string", format: "binary" }
          }
        }
      },
      VideoToggleRequest: {
        type: "object",
        required: ["isAdded", "video_id", "drill_id"],
        properties: {
          isAdded: { type: "boolean" },
          video_id: { type: "string" },
          drill_id: { type: "string" }
        }
      },
      FollowUserRequest: {
        type: "object",
        required: ["isAdded", "following"],
        properties: {
          isAdded: { type: "boolean" },
          following: { type: "string" }
        }
      },
      PointsRequest: {
        type: "object",
        required: ["watchedVideos"],
        properties: {
          watchedVideos: {
            type: "array",
            items: {
              type: "object",
              required: ["drill_id", "diffculty_id", "speed_level_id", "video_id"],
              properties: {
                drill_id: { type: "string" },
                diffculty_id: { type: "string" },
                speed_level_id: { type: "string" },
                video_id: { type: "string" },
                watch_count: { type: "integer", default: 1 }
              }
            }
          }
        }
      },
      TotalLikesRequest: {
        type: "object",
        required: ["drill_id", "video_id", "isLike"],
        properties: {
          drill_id: { type: "string" },
          video_id: { type: "string" },
          isLike: { type: "boolean" }
        }
      },
      ActivityRequest: {
        type: "object",
        required: ["type"],
        properties: {
          type: { type: "string" },
          video_id: { type: "string", nullable: true },
          drill_id: { type: "string", nullable: true }
        }
      },
      CheckoutRequest: {
        type: "object",
        required: ["sub_id", "data"],
        properties: {
          sub_id: { type: "string" },
          data: {
            type: "object",
            required: ["nonce"],
            properties: {
              nonce: { type: "string" },
              detail: { type: "string", nullable: true }
            }
          }
        }
      }
    }
  },
  paths
};
