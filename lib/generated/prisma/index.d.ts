
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Hotel
 * 
 */
export type Hotel = $Result.DefaultSelection<Prisma.$HotelPayload>
/**
 * Model Room
 * 
 */
export type Room = $Result.DefaultSelection<Prisma.$RoomPayload>
/**
 * Model Booking
 * 
 */
export type Booking = $Result.DefaultSelection<Prisma.$BookingPayload>
/**
 * Model Stairs
 * 
 */
export type Stairs = $Result.DefaultSelection<Prisma.$StairsPayload>
/**
 * Model Invite
 * 
 */
export type Invite = $Result.DefaultSelection<Prisma.$InvitePayload>
/**
 * Model Feedback
 * 
 */
export type Feedback = $Result.DefaultSelection<Prisma.$FeedbackPayload>
/**
 * Model RegistrationToken
 * 
 */
export type RegistrationToken = $Result.DefaultSelection<Prisma.$RegistrationTokenPayload>
/**
 * Model BookingDateRange
 * 
 */
export type BookingDateRange = $Result.DefaultSelection<Prisma.$BookingDateRangePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  developer: 'developer',
  manager: 'manager',
  guest: 'guest'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const RoomType: {
  FZ: 'FZ',
  DZ: 'DZ',
  EZ: 'EZ',
  MZ: 'MZ',
  App: 'App',
  COMMON: 'COMMON'
};

export type RoomType = (typeof RoomType)[keyof typeof RoomType]


export const FloorType: {
  EG: 'EG',
  oneOG: '1OG',
  twoOG: '2OG',
  threeOG: '3OG',
  fourOG: '4OG',
  fiveOG: '5OG',
  sixOG: '6OG'
};

export type FloorType = (typeof FloorType)[keyof typeof FloorType]


export const PaymentMethod: {
  cash: 'cash',
  transfer: 'transfer'
};

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod]


export const StairsDirection: {
  up: 'up',
  down: 'down',
  both: 'both'
};

export type StairsDirection = (typeof StairsDirection)[keyof typeof StairsDirection]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type RoomType = $Enums.RoomType

export const RoomType: typeof $Enums.RoomType

export type FloorType = $Enums.FloorType

export const FloorType: typeof $Enums.FloorType

export type PaymentMethod = $Enums.PaymentMethod

export const PaymentMethod: typeof $Enums.PaymentMethod

export type StairsDirection = $Enums.StairsDirection

export const StairsDirection: typeof $Enums.StairsDirection

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.hotel`: Exposes CRUD operations for the **Hotel** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Hotels
    * const hotels = await prisma.hotel.findMany()
    * ```
    */
  get hotel(): Prisma.HotelDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.room`: Exposes CRUD operations for the **Room** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Rooms
    * const rooms = await prisma.room.findMany()
    * ```
    */
  get room(): Prisma.RoomDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.booking`: Exposes CRUD operations for the **Booking** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Bookings
    * const bookings = await prisma.booking.findMany()
    * ```
    */
  get booking(): Prisma.BookingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.stairs`: Exposes CRUD operations for the **Stairs** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Stairs
    * const stairs = await prisma.stairs.findMany()
    * ```
    */
  get stairs(): Prisma.StairsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.invite`: Exposes CRUD operations for the **Invite** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Invites
    * const invites = await prisma.invite.findMany()
    * ```
    */
  get invite(): Prisma.InviteDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.feedback`: Exposes CRUD operations for the **Feedback** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Feedbacks
    * const feedbacks = await prisma.feedback.findMany()
    * ```
    */
  get feedback(): Prisma.FeedbackDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.registrationToken`: Exposes CRUD operations for the **RegistrationToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RegistrationTokens
    * const registrationTokens = await prisma.registrationToken.findMany()
    * ```
    */
  get registrationToken(): Prisma.RegistrationTokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bookingDateRange`: Exposes CRUD operations for the **BookingDateRange** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BookingDateRanges
    * const bookingDateRanges = await prisma.bookingDateRange.findMany()
    * ```
    */
  get bookingDateRange(): Prisma.BookingDateRangeDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.0.1
   * Query Engine version: f09f2815f091dbba658cdcd2264306d88bb5bda6
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Hotel: 'Hotel',
    Room: 'Room',
    Booking: 'Booking',
    Stairs: 'Stairs',
    Invite: 'Invite',
    Feedback: 'Feedback',
    RegistrationToken: 'RegistrationToken',
    BookingDateRange: 'BookingDateRange'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "hotel" | "room" | "booking" | "stairs" | "invite" | "feedback" | "registrationToken" | "bookingDateRange"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Hotel: {
        payload: Prisma.$HotelPayload<ExtArgs>
        fields: Prisma.HotelFieldRefs
        operations: {
          findUnique: {
            args: Prisma.HotelFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotelPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.HotelFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotelPayload>
          }
          findFirst: {
            args: Prisma.HotelFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotelPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.HotelFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotelPayload>
          }
          findMany: {
            args: Prisma.HotelFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotelPayload>[]
          }
          create: {
            args: Prisma.HotelCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotelPayload>
          }
          createMany: {
            args: Prisma.HotelCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.HotelCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotelPayload>[]
          }
          delete: {
            args: Prisma.HotelDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotelPayload>
          }
          update: {
            args: Prisma.HotelUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotelPayload>
          }
          deleteMany: {
            args: Prisma.HotelDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.HotelUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.HotelUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotelPayload>[]
          }
          upsert: {
            args: Prisma.HotelUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotelPayload>
          }
          aggregate: {
            args: Prisma.HotelAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHotel>
          }
          groupBy: {
            args: Prisma.HotelGroupByArgs<ExtArgs>
            result: $Utils.Optional<HotelGroupByOutputType>[]
          }
          count: {
            args: Prisma.HotelCountArgs<ExtArgs>
            result: $Utils.Optional<HotelCountAggregateOutputType> | number
          }
        }
      }
      Room: {
        payload: Prisma.$RoomPayload<ExtArgs>
        fields: Prisma.RoomFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoomFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoomFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>
          }
          findFirst: {
            args: Prisma.RoomFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoomFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>
          }
          findMany: {
            args: Prisma.RoomFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>[]
          }
          create: {
            args: Prisma.RoomCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>
          }
          createMany: {
            args: Prisma.RoomCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoomCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>[]
          }
          delete: {
            args: Prisma.RoomDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>
          }
          update: {
            args: Prisma.RoomUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>
          }
          deleteMany: {
            args: Prisma.RoomDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoomUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoomUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>[]
          }
          upsert: {
            args: Prisma.RoomUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>
          }
          aggregate: {
            args: Prisma.RoomAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoom>
          }
          groupBy: {
            args: Prisma.RoomGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoomGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoomCountArgs<ExtArgs>
            result: $Utils.Optional<RoomCountAggregateOutputType> | number
          }
        }
      }
      Booking: {
        payload: Prisma.$BookingPayload<ExtArgs>
        fields: Prisma.BookingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BookingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BookingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          findFirst: {
            args: Prisma.BookingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BookingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          findMany: {
            args: Prisma.BookingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>[]
          }
          create: {
            args: Prisma.BookingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          createMany: {
            args: Prisma.BookingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BookingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>[]
          }
          delete: {
            args: Prisma.BookingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          update: {
            args: Prisma.BookingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          deleteMany: {
            args: Prisma.BookingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BookingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BookingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>[]
          }
          upsert: {
            args: Prisma.BookingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          aggregate: {
            args: Prisma.BookingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBooking>
          }
          groupBy: {
            args: Prisma.BookingGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookingGroupByOutputType>[]
          }
          count: {
            args: Prisma.BookingCountArgs<ExtArgs>
            result: $Utils.Optional<BookingCountAggregateOutputType> | number
          }
        }
      }
      Stairs: {
        payload: Prisma.$StairsPayload<ExtArgs>
        fields: Prisma.StairsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StairsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StairsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StairsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StairsPayload>
          }
          findFirst: {
            args: Prisma.StairsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StairsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StairsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StairsPayload>
          }
          findMany: {
            args: Prisma.StairsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StairsPayload>[]
          }
          create: {
            args: Prisma.StairsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StairsPayload>
          }
          createMany: {
            args: Prisma.StairsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StairsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StairsPayload>[]
          }
          delete: {
            args: Prisma.StairsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StairsPayload>
          }
          update: {
            args: Prisma.StairsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StairsPayload>
          }
          deleteMany: {
            args: Prisma.StairsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StairsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StairsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StairsPayload>[]
          }
          upsert: {
            args: Prisma.StairsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StairsPayload>
          }
          aggregate: {
            args: Prisma.StairsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStairs>
          }
          groupBy: {
            args: Prisma.StairsGroupByArgs<ExtArgs>
            result: $Utils.Optional<StairsGroupByOutputType>[]
          }
          count: {
            args: Prisma.StairsCountArgs<ExtArgs>
            result: $Utils.Optional<StairsCountAggregateOutputType> | number
          }
        }
      }
      Invite: {
        payload: Prisma.$InvitePayload<ExtArgs>
        fields: Prisma.InviteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InviteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InviteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitePayload>
          }
          findFirst: {
            args: Prisma.InviteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InviteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitePayload>
          }
          findMany: {
            args: Prisma.InviteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitePayload>[]
          }
          create: {
            args: Prisma.InviteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitePayload>
          }
          createMany: {
            args: Prisma.InviteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InviteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitePayload>[]
          }
          delete: {
            args: Prisma.InviteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitePayload>
          }
          update: {
            args: Prisma.InviteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitePayload>
          }
          deleteMany: {
            args: Prisma.InviteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InviteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InviteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitePayload>[]
          }
          upsert: {
            args: Prisma.InviteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitePayload>
          }
          aggregate: {
            args: Prisma.InviteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvite>
          }
          groupBy: {
            args: Prisma.InviteGroupByArgs<ExtArgs>
            result: $Utils.Optional<InviteGroupByOutputType>[]
          }
          count: {
            args: Prisma.InviteCountArgs<ExtArgs>
            result: $Utils.Optional<InviteCountAggregateOutputType> | number
          }
        }
      }
      Feedback: {
        payload: Prisma.$FeedbackPayload<ExtArgs>
        fields: Prisma.FeedbackFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FeedbackFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FeedbackFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          findFirst: {
            args: Prisma.FeedbackFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FeedbackFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          findMany: {
            args: Prisma.FeedbackFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>[]
          }
          create: {
            args: Prisma.FeedbackCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          createMany: {
            args: Prisma.FeedbackCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FeedbackCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>[]
          }
          delete: {
            args: Prisma.FeedbackDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          update: {
            args: Prisma.FeedbackUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          deleteMany: {
            args: Prisma.FeedbackDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FeedbackUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FeedbackUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>[]
          }
          upsert: {
            args: Prisma.FeedbackUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          aggregate: {
            args: Prisma.FeedbackAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFeedback>
          }
          groupBy: {
            args: Prisma.FeedbackGroupByArgs<ExtArgs>
            result: $Utils.Optional<FeedbackGroupByOutputType>[]
          }
          count: {
            args: Prisma.FeedbackCountArgs<ExtArgs>
            result: $Utils.Optional<FeedbackCountAggregateOutputType> | number
          }
        }
      }
      RegistrationToken: {
        payload: Prisma.$RegistrationTokenPayload<ExtArgs>
        fields: Prisma.RegistrationTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RegistrationTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RegistrationTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationTokenPayload>
          }
          findFirst: {
            args: Prisma.RegistrationTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RegistrationTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationTokenPayload>
          }
          findMany: {
            args: Prisma.RegistrationTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationTokenPayload>[]
          }
          create: {
            args: Prisma.RegistrationTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationTokenPayload>
          }
          createMany: {
            args: Prisma.RegistrationTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RegistrationTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationTokenPayload>[]
          }
          delete: {
            args: Prisma.RegistrationTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationTokenPayload>
          }
          update: {
            args: Prisma.RegistrationTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationTokenPayload>
          }
          deleteMany: {
            args: Prisma.RegistrationTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RegistrationTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RegistrationTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationTokenPayload>[]
          }
          upsert: {
            args: Prisma.RegistrationTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationTokenPayload>
          }
          aggregate: {
            args: Prisma.RegistrationTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRegistrationToken>
          }
          groupBy: {
            args: Prisma.RegistrationTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<RegistrationTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.RegistrationTokenCountArgs<ExtArgs>
            result: $Utils.Optional<RegistrationTokenCountAggregateOutputType> | number
          }
        }
      }
      BookingDateRange: {
        payload: Prisma.$BookingDateRangePayload<ExtArgs>
        fields: Prisma.BookingDateRangeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BookingDateRangeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingDateRangePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BookingDateRangeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingDateRangePayload>
          }
          findFirst: {
            args: Prisma.BookingDateRangeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingDateRangePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BookingDateRangeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingDateRangePayload>
          }
          findMany: {
            args: Prisma.BookingDateRangeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingDateRangePayload>[]
          }
          create: {
            args: Prisma.BookingDateRangeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingDateRangePayload>
          }
          createMany: {
            args: Prisma.BookingDateRangeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BookingDateRangeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingDateRangePayload>[]
          }
          delete: {
            args: Prisma.BookingDateRangeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingDateRangePayload>
          }
          update: {
            args: Prisma.BookingDateRangeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingDateRangePayload>
          }
          deleteMany: {
            args: Prisma.BookingDateRangeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BookingDateRangeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BookingDateRangeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingDateRangePayload>[]
          }
          upsert: {
            args: Prisma.BookingDateRangeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingDateRangePayload>
          }
          aggregate: {
            args: Prisma.BookingDateRangeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBookingDateRange>
          }
          groupBy: {
            args: Prisma.BookingDateRangeGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookingDateRangeGroupByOutputType>[]
          }
          count: {
            args: Prisma.BookingDateRangeCountArgs<ExtArgs>
            result: $Utils.Optional<BookingDateRangeCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    hotel?: HotelOmit
    room?: RoomOmit
    booking?: BookingOmit
    stairs?: StairsOmit
    invite?: InviteOmit
    feedback?: FeedbackOmit
    registrationToken?: RegistrationTokenOmit
    bookingDateRange?: BookingDateRangeOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    createdInvites: number
    usedInvites: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdInvites?: boolean | UserCountOutputTypeCountCreatedInvitesArgs
    usedInvites?: boolean | UserCountOutputTypeCountUsedInvitesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCreatedInvitesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InviteWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountUsedInvitesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InviteWhereInput
  }


  /**
   * Count Type HotelCountOutputType
   */

  export type HotelCountOutputType = {
    rooms: number
    stairs: number
  }

  export type HotelCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rooms?: boolean | HotelCountOutputTypeCountRoomsArgs
    stairs?: boolean | HotelCountOutputTypeCountStairsArgs
  }

  // Custom InputTypes
  /**
   * HotelCountOutputType without action
   */
  export type HotelCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotelCountOutputType
     */
    select?: HotelCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * HotelCountOutputType without action
   */
  export type HotelCountOutputTypeCountRoomsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoomWhereInput
  }

  /**
   * HotelCountOutputType without action
   */
  export type HotelCountOutputTypeCountStairsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StairsWhereInput
  }


  /**
   * Count Type RoomCountOutputType
   */

  export type RoomCountOutputType = {
    bookings: number
  }

  export type RoomCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookings?: boolean | RoomCountOutputTypeCountBookingsArgs
  }

  // Custom InputTypes
  /**
   * RoomCountOutputType without action
   */
  export type RoomCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomCountOutputType
     */
    select?: RoomCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RoomCountOutputType without action
   */
  export type RoomCountOutputTypeCountBookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    password: string | null
    phone: string | null
    role: $Enums.UserRole | null
    isProfileComplete: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    password: string | null
    phone: string | null
    role: $Enums.UserRole | null
    isProfileComplete: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    password: number
    phone: number
    role: number
    isProfileComplete: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
    phone?: true
    role?: true
    isProfileComplete?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
    phone?: true
    role?: true
    isProfileComplete?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
    phone?: true
    role?: true
    isProfileComplete?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string | null
    name: string
    password: string | null
    phone: string | null
    role: $Enums.UserRole
    isProfileComplete: boolean
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    phone?: boolean
    role?: boolean
    isProfileComplete?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdInvites?: boolean | User$createdInvitesArgs<ExtArgs>
    usedInvites?: boolean | User$usedInvitesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    phone?: boolean
    role?: boolean
    isProfileComplete?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    phone?: boolean
    role?: boolean
    isProfileComplete?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    phone?: boolean
    role?: boolean
    isProfileComplete?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name" | "password" | "phone" | "role" | "isProfileComplete" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdInvites?: boolean | User$createdInvitesArgs<ExtArgs>
    usedInvites?: boolean | User$usedInvitesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      createdInvites: Prisma.$InvitePayload<ExtArgs>[]
      usedInvites: Prisma.$InvitePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string | null
      name: string
      password: string | null
      phone: string | null
      role: $Enums.UserRole
      isProfileComplete: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    createdInvites<T extends User$createdInvitesArgs<ExtArgs> = {}>(args?: Subset<T, User$createdInvitesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    usedInvites<T extends User$usedInvitesArgs<ExtArgs> = {}>(args?: Subset<T, User$usedInvitesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly isProfileComplete: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.createdInvites
   */
  export type User$createdInvitesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invite
     */
    select?: InviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invite
     */
    omit?: InviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InviteInclude<ExtArgs> | null
    where?: InviteWhereInput
    orderBy?: InviteOrderByWithRelationInput | InviteOrderByWithRelationInput[]
    cursor?: InviteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InviteScalarFieldEnum | InviteScalarFieldEnum[]
  }

  /**
   * User.usedInvites
   */
  export type User$usedInvitesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invite
     */
    select?: InviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invite
     */
    omit?: InviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InviteInclude<ExtArgs> | null
    where?: InviteWhereInput
    orderBy?: InviteOrderByWithRelationInput | InviteOrderByWithRelationInput[]
    cursor?: InviteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InviteScalarFieldEnum | InviteScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Hotel
   */

  export type AggregateHotel = {
    _count: HotelCountAggregateOutputType | null
    _avg: HotelAvgAggregateOutputType | null
    _sum: HotelSumAggregateOutputType | null
    _min: HotelMinAggregateOutputType | null
    _max: HotelMaxAggregateOutputType | null
  }

  export type HotelAvgAggregateOutputType = {
    floors: number | null
    displayOrder: number | null
  }

  export type HotelSumAggregateOutputType = {
    floors: number | null
    displayOrder: number | null
  }

  export type HotelMinAggregateOutputType = {
    id: string | null
    name: string | null
    address: string | null
    description: string | null
    floors: number | null
    hasEGFloor: boolean | null
    image: Bytes | null
    displayOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type HotelMaxAggregateOutputType = {
    id: string | null
    name: string | null
    address: string | null
    description: string | null
    floors: number | null
    hasEGFloor: boolean | null
    image: Bytes | null
    displayOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type HotelCountAggregateOutputType = {
    id: number
    name: number
    address: number
    description: number
    floors: number
    hasEGFloor: number
    image: number
    displayOrder: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type HotelAvgAggregateInputType = {
    floors?: true
    displayOrder?: true
  }

  export type HotelSumAggregateInputType = {
    floors?: true
    displayOrder?: true
  }

  export type HotelMinAggregateInputType = {
    id?: true
    name?: true
    address?: true
    description?: true
    floors?: true
    hasEGFloor?: true
    image?: true
    displayOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type HotelMaxAggregateInputType = {
    id?: true
    name?: true
    address?: true
    description?: true
    floors?: true
    hasEGFloor?: true
    image?: true
    displayOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type HotelCountAggregateInputType = {
    id?: true
    name?: true
    address?: true
    description?: true
    floors?: true
    hasEGFloor?: true
    image?: true
    displayOrder?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type HotelAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Hotel to aggregate.
     */
    where?: HotelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Hotels to fetch.
     */
    orderBy?: HotelOrderByWithRelationInput | HotelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: HotelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Hotels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Hotels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Hotels
    **/
    _count?: true | HotelCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: HotelAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: HotelSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HotelMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HotelMaxAggregateInputType
  }

  export type GetHotelAggregateType<T extends HotelAggregateArgs> = {
        [P in keyof T & keyof AggregateHotel]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHotel[P]>
      : GetScalarType<T[P], AggregateHotel[P]>
  }




  export type HotelGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HotelWhereInput
    orderBy?: HotelOrderByWithAggregationInput | HotelOrderByWithAggregationInput[]
    by: HotelScalarFieldEnum[] | HotelScalarFieldEnum
    having?: HotelScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HotelCountAggregateInputType | true
    _avg?: HotelAvgAggregateInputType
    _sum?: HotelSumAggregateInputType
    _min?: HotelMinAggregateInputType
    _max?: HotelMaxAggregateInputType
  }

  export type HotelGroupByOutputType = {
    id: string
    name: string
    address: string
    description: string | null
    floors: number | null
    hasEGFloor: boolean
    image: Bytes | null
    displayOrder: number | null
    createdAt: Date
    updatedAt: Date
    _count: HotelCountAggregateOutputType | null
    _avg: HotelAvgAggregateOutputType | null
    _sum: HotelSumAggregateOutputType | null
    _min: HotelMinAggregateOutputType | null
    _max: HotelMaxAggregateOutputType | null
  }

  type GetHotelGroupByPayload<T extends HotelGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HotelGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HotelGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HotelGroupByOutputType[P]>
            : GetScalarType<T[P], HotelGroupByOutputType[P]>
        }
      >
    >


  export type HotelSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    address?: boolean
    description?: boolean
    floors?: boolean
    hasEGFloor?: boolean
    image?: boolean
    displayOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    rooms?: boolean | Hotel$roomsArgs<ExtArgs>
    stairs?: boolean | Hotel$stairsArgs<ExtArgs>
    _count?: boolean | HotelCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["hotel"]>

  export type HotelSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    address?: boolean
    description?: boolean
    floors?: boolean
    hasEGFloor?: boolean
    image?: boolean
    displayOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["hotel"]>

  export type HotelSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    address?: boolean
    description?: boolean
    floors?: boolean
    hasEGFloor?: boolean
    image?: boolean
    displayOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["hotel"]>

  export type HotelSelectScalar = {
    id?: boolean
    name?: boolean
    address?: boolean
    description?: boolean
    floors?: boolean
    hasEGFloor?: boolean
    image?: boolean
    displayOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type HotelOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "address" | "description" | "floors" | "hasEGFloor" | "image" | "displayOrder" | "createdAt" | "updatedAt", ExtArgs["result"]["hotel"]>
  export type HotelInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rooms?: boolean | Hotel$roomsArgs<ExtArgs>
    stairs?: boolean | Hotel$stairsArgs<ExtArgs>
    _count?: boolean | HotelCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type HotelIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type HotelIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $HotelPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Hotel"
    objects: {
      rooms: Prisma.$RoomPayload<ExtArgs>[]
      stairs: Prisma.$StairsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      address: string
      description: string | null
      floors: number | null
      hasEGFloor: boolean
      image: Prisma.Bytes | null
      displayOrder: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["hotel"]>
    composites: {}
  }

  type HotelGetPayload<S extends boolean | null | undefined | HotelDefaultArgs> = $Result.GetResult<Prisma.$HotelPayload, S>

  type HotelCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<HotelFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: HotelCountAggregateInputType | true
    }

  export interface HotelDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Hotel'], meta: { name: 'Hotel' } }
    /**
     * Find zero or one Hotel that matches the filter.
     * @param {HotelFindUniqueArgs} args - Arguments to find a Hotel
     * @example
     * // Get one Hotel
     * const hotel = await prisma.hotel.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HotelFindUniqueArgs>(args: SelectSubset<T, HotelFindUniqueArgs<ExtArgs>>): Prisma__HotelClient<$Result.GetResult<Prisma.$HotelPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Hotel that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {HotelFindUniqueOrThrowArgs} args - Arguments to find a Hotel
     * @example
     * // Get one Hotel
     * const hotel = await prisma.hotel.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HotelFindUniqueOrThrowArgs>(args: SelectSubset<T, HotelFindUniqueOrThrowArgs<ExtArgs>>): Prisma__HotelClient<$Result.GetResult<Prisma.$HotelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Hotel that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HotelFindFirstArgs} args - Arguments to find a Hotel
     * @example
     * // Get one Hotel
     * const hotel = await prisma.hotel.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HotelFindFirstArgs>(args?: SelectSubset<T, HotelFindFirstArgs<ExtArgs>>): Prisma__HotelClient<$Result.GetResult<Prisma.$HotelPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Hotel that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HotelFindFirstOrThrowArgs} args - Arguments to find a Hotel
     * @example
     * // Get one Hotel
     * const hotel = await prisma.hotel.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HotelFindFirstOrThrowArgs>(args?: SelectSubset<T, HotelFindFirstOrThrowArgs<ExtArgs>>): Prisma__HotelClient<$Result.GetResult<Prisma.$HotelPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Hotels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HotelFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Hotels
     * const hotels = await prisma.hotel.findMany()
     * 
     * // Get first 10 Hotels
     * const hotels = await prisma.hotel.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const hotelWithIdOnly = await prisma.hotel.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends HotelFindManyArgs>(args?: SelectSubset<T, HotelFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HotelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Hotel.
     * @param {HotelCreateArgs} args - Arguments to create a Hotel.
     * @example
     * // Create one Hotel
     * const Hotel = await prisma.hotel.create({
     *   data: {
     *     // ... data to create a Hotel
     *   }
     * })
     * 
     */
    create<T extends HotelCreateArgs>(args: SelectSubset<T, HotelCreateArgs<ExtArgs>>): Prisma__HotelClient<$Result.GetResult<Prisma.$HotelPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Hotels.
     * @param {HotelCreateManyArgs} args - Arguments to create many Hotels.
     * @example
     * // Create many Hotels
     * const hotel = await prisma.hotel.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends HotelCreateManyArgs>(args?: SelectSubset<T, HotelCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Hotels and returns the data saved in the database.
     * @param {HotelCreateManyAndReturnArgs} args - Arguments to create many Hotels.
     * @example
     * // Create many Hotels
     * const hotel = await prisma.hotel.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Hotels and only return the `id`
     * const hotelWithIdOnly = await prisma.hotel.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends HotelCreateManyAndReturnArgs>(args?: SelectSubset<T, HotelCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HotelPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Hotel.
     * @param {HotelDeleteArgs} args - Arguments to delete one Hotel.
     * @example
     * // Delete one Hotel
     * const Hotel = await prisma.hotel.delete({
     *   where: {
     *     // ... filter to delete one Hotel
     *   }
     * })
     * 
     */
    delete<T extends HotelDeleteArgs>(args: SelectSubset<T, HotelDeleteArgs<ExtArgs>>): Prisma__HotelClient<$Result.GetResult<Prisma.$HotelPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Hotel.
     * @param {HotelUpdateArgs} args - Arguments to update one Hotel.
     * @example
     * // Update one Hotel
     * const hotel = await prisma.hotel.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends HotelUpdateArgs>(args: SelectSubset<T, HotelUpdateArgs<ExtArgs>>): Prisma__HotelClient<$Result.GetResult<Prisma.$HotelPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Hotels.
     * @param {HotelDeleteManyArgs} args - Arguments to filter Hotels to delete.
     * @example
     * // Delete a few Hotels
     * const { count } = await prisma.hotel.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends HotelDeleteManyArgs>(args?: SelectSubset<T, HotelDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Hotels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HotelUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Hotels
     * const hotel = await prisma.hotel.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends HotelUpdateManyArgs>(args: SelectSubset<T, HotelUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Hotels and returns the data updated in the database.
     * @param {HotelUpdateManyAndReturnArgs} args - Arguments to update many Hotels.
     * @example
     * // Update many Hotels
     * const hotel = await prisma.hotel.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Hotels and only return the `id`
     * const hotelWithIdOnly = await prisma.hotel.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends HotelUpdateManyAndReturnArgs>(args: SelectSubset<T, HotelUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HotelPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Hotel.
     * @param {HotelUpsertArgs} args - Arguments to update or create a Hotel.
     * @example
     * // Update or create a Hotel
     * const hotel = await prisma.hotel.upsert({
     *   create: {
     *     // ... data to create a Hotel
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Hotel we want to update
     *   }
     * })
     */
    upsert<T extends HotelUpsertArgs>(args: SelectSubset<T, HotelUpsertArgs<ExtArgs>>): Prisma__HotelClient<$Result.GetResult<Prisma.$HotelPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Hotels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HotelCountArgs} args - Arguments to filter Hotels to count.
     * @example
     * // Count the number of Hotels
     * const count = await prisma.hotel.count({
     *   where: {
     *     // ... the filter for the Hotels we want to count
     *   }
     * })
    **/
    count<T extends HotelCountArgs>(
      args?: Subset<T, HotelCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HotelCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Hotel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HotelAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends HotelAggregateArgs>(args: Subset<T, HotelAggregateArgs>): Prisma.PrismaPromise<GetHotelAggregateType<T>>

    /**
     * Group by Hotel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HotelGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends HotelGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HotelGroupByArgs['orderBy'] }
        : { orderBy?: HotelGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, HotelGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHotelGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Hotel model
   */
  readonly fields: HotelFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Hotel.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__HotelClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    rooms<T extends Hotel$roomsArgs<ExtArgs> = {}>(args?: Subset<T, Hotel$roomsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    stairs<T extends Hotel$stairsArgs<ExtArgs> = {}>(args?: Subset<T, Hotel$stairsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StairsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Hotel model
   */
  interface HotelFieldRefs {
    readonly id: FieldRef<"Hotel", 'String'>
    readonly name: FieldRef<"Hotel", 'String'>
    readonly address: FieldRef<"Hotel", 'String'>
    readonly description: FieldRef<"Hotel", 'String'>
    readonly floors: FieldRef<"Hotel", 'Int'>
    readonly hasEGFloor: FieldRef<"Hotel", 'Boolean'>
    readonly image: FieldRef<"Hotel", 'Bytes'>
    readonly displayOrder: FieldRef<"Hotel", 'Int'>
    readonly createdAt: FieldRef<"Hotel", 'DateTime'>
    readonly updatedAt: FieldRef<"Hotel", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Hotel findUnique
   */
  export type HotelFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hotel
     */
    select?: HotelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hotel
     */
    omit?: HotelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotelInclude<ExtArgs> | null
    /**
     * Filter, which Hotel to fetch.
     */
    where: HotelWhereUniqueInput
  }

  /**
   * Hotel findUniqueOrThrow
   */
  export type HotelFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hotel
     */
    select?: HotelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hotel
     */
    omit?: HotelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotelInclude<ExtArgs> | null
    /**
     * Filter, which Hotel to fetch.
     */
    where: HotelWhereUniqueInput
  }

  /**
   * Hotel findFirst
   */
  export type HotelFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hotel
     */
    select?: HotelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hotel
     */
    omit?: HotelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotelInclude<ExtArgs> | null
    /**
     * Filter, which Hotel to fetch.
     */
    where?: HotelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Hotels to fetch.
     */
    orderBy?: HotelOrderByWithRelationInput | HotelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Hotels.
     */
    cursor?: HotelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Hotels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Hotels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Hotels.
     */
    distinct?: HotelScalarFieldEnum | HotelScalarFieldEnum[]
  }

  /**
   * Hotel findFirstOrThrow
   */
  export type HotelFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hotel
     */
    select?: HotelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hotel
     */
    omit?: HotelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotelInclude<ExtArgs> | null
    /**
     * Filter, which Hotel to fetch.
     */
    where?: HotelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Hotels to fetch.
     */
    orderBy?: HotelOrderByWithRelationInput | HotelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Hotels.
     */
    cursor?: HotelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Hotels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Hotels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Hotels.
     */
    distinct?: HotelScalarFieldEnum | HotelScalarFieldEnum[]
  }

  /**
   * Hotel findMany
   */
  export type HotelFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hotel
     */
    select?: HotelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hotel
     */
    omit?: HotelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotelInclude<ExtArgs> | null
    /**
     * Filter, which Hotels to fetch.
     */
    where?: HotelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Hotels to fetch.
     */
    orderBy?: HotelOrderByWithRelationInput | HotelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Hotels.
     */
    cursor?: HotelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Hotels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Hotels.
     */
    skip?: number
    distinct?: HotelScalarFieldEnum | HotelScalarFieldEnum[]
  }

  /**
   * Hotel create
   */
  export type HotelCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hotel
     */
    select?: HotelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hotel
     */
    omit?: HotelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotelInclude<ExtArgs> | null
    /**
     * The data needed to create a Hotel.
     */
    data: XOR<HotelCreateInput, HotelUncheckedCreateInput>
  }

  /**
   * Hotel createMany
   */
  export type HotelCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Hotels.
     */
    data: HotelCreateManyInput | HotelCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Hotel createManyAndReturn
   */
  export type HotelCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hotel
     */
    select?: HotelSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Hotel
     */
    omit?: HotelOmit<ExtArgs> | null
    /**
     * The data used to create many Hotels.
     */
    data: HotelCreateManyInput | HotelCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Hotel update
   */
  export type HotelUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hotel
     */
    select?: HotelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hotel
     */
    omit?: HotelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotelInclude<ExtArgs> | null
    /**
     * The data needed to update a Hotel.
     */
    data: XOR<HotelUpdateInput, HotelUncheckedUpdateInput>
    /**
     * Choose, which Hotel to update.
     */
    where: HotelWhereUniqueInput
  }

  /**
   * Hotel updateMany
   */
  export type HotelUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Hotels.
     */
    data: XOR<HotelUpdateManyMutationInput, HotelUncheckedUpdateManyInput>
    /**
     * Filter which Hotels to update
     */
    where?: HotelWhereInput
    /**
     * Limit how many Hotels to update.
     */
    limit?: number
  }

  /**
   * Hotel updateManyAndReturn
   */
  export type HotelUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hotel
     */
    select?: HotelSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Hotel
     */
    omit?: HotelOmit<ExtArgs> | null
    /**
     * The data used to update Hotels.
     */
    data: XOR<HotelUpdateManyMutationInput, HotelUncheckedUpdateManyInput>
    /**
     * Filter which Hotels to update
     */
    where?: HotelWhereInput
    /**
     * Limit how many Hotels to update.
     */
    limit?: number
  }

  /**
   * Hotel upsert
   */
  export type HotelUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hotel
     */
    select?: HotelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hotel
     */
    omit?: HotelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotelInclude<ExtArgs> | null
    /**
     * The filter to search for the Hotel to update in case it exists.
     */
    where: HotelWhereUniqueInput
    /**
     * In case the Hotel found by the `where` argument doesn't exist, create a new Hotel with this data.
     */
    create: XOR<HotelCreateInput, HotelUncheckedCreateInput>
    /**
     * In case the Hotel was found with the provided `where` argument, update it with this data.
     */
    update: XOR<HotelUpdateInput, HotelUncheckedUpdateInput>
  }

  /**
   * Hotel delete
   */
  export type HotelDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hotel
     */
    select?: HotelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hotel
     */
    omit?: HotelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotelInclude<ExtArgs> | null
    /**
     * Filter which Hotel to delete.
     */
    where: HotelWhereUniqueInput
  }

  /**
   * Hotel deleteMany
   */
  export type HotelDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Hotels to delete
     */
    where?: HotelWhereInput
    /**
     * Limit how many Hotels to delete.
     */
    limit?: number
  }

  /**
   * Hotel.rooms
   */
  export type Hotel$roomsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    where?: RoomWhereInput
    orderBy?: RoomOrderByWithRelationInput | RoomOrderByWithRelationInput[]
    cursor?: RoomWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RoomScalarFieldEnum | RoomScalarFieldEnum[]
  }

  /**
   * Hotel.stairs
   */
  export type Hotel$stairsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stairs
     */
    select?: StairsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Stairs
     */
    omit?: StairsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StairsInclude<ExtArgs> | null
    where?: StairsWhereInput
    orderBy?: StairsOrderByWithRelationInput | StairsOrderByWithRelationInput[]
    cursor?: StairsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StairsScalarFieldEnum | StairsScalarFieldEnum[]
  }

  /**
   * Hotel without action
   */
  export type HotelDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hotel
     */
    select?: HotelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hotel
     */
    omit?: HotelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HotelInclude<ExtArgs> | null
  }


  /**
   * Model Room
   */

  export type AggregateRoom = {
    _count: RoomCountAggregateOutputType | null
    _avg: RoomAvgAggregateOutputType | null
    _sum: RoomSumAggregateOutputType | null
    _min: RoomMinAggregateOutputType | null
    _max: RoomMaxAggregateOutputType | null
  }

  export type RoomAvgAggregateOutputType = {
    maxCapacity: number | null
    price: Decimal | null
    width: number | null
    height: number | null
    zIndex: number | null
  }

  export type RoomSumAggregateOutputType = {
    maxCapacity: number | null
    price: Decimal | null
    width: number | null
    height: number | null
    zIndex: number | null
  }

  export type RoomMinAggregateOutputType = {
    id: string | null
    number: string | null
    hotelId: string | null
    name: string | null
    type: $Enums.RoomType | null
    capacity: string | null
    maxCapacity: number | null
    floor: $Enums.FloorType | null
    price: Decimal | null
    width: number | null
    height: number | null
    isCommon: boolean | null
    zIndex: number | null
    description: string | null
    hasShower: boolean | null
    hasToilet: boolean | null
    pricePerPerson: boolean | null
    textVertical: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoomMaxAggregateOutputType = {
    id: string | null
    number: string | null
    hotelId: string | null
    name: string | null
    type: $Enums.RoomType | null
    capacity: string | null
    maxCapacity: number | null
    floor: $Enums.FloorType | null
    price: Decimal | null
    width: number | null
    height: number | null
    isCommon: boolean | null
    zIndex: number | null
    description: string | null
    hasShower: boolean | null
    hasToilet: boolean | null
    pricePerPerson: boolean | null
    textVertical: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoomCountAggregateOutputType = {
    id: number
    number: number
    hotelId: number
    name: number
    type: number
    capacity: number
    maxCapacity: number
    beds: number
    floor: number
    price: number
    position: number
    width: number
    height: number
    isCommon: number
    zIndex: number
    description: number
    hasShower: number
    hasToilet: number
    pricePerPerson: number
    textVertical: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RoomAvgAggregateInputType = {
    maxCapacity?: true
    price?: true
    width?: true
    height?: true
    zIndex?: true
  }

  export type RoomSumAggregateInputType = {
    maxCapacity?: true
    price?: true
    width?: true
    height?: true
    zIndex?: true
  }

  export type RoomMinAggregateInputType = {
    id?: true
    number?: true
    hotelId?: true
    name?: true
    type?: true
    capacity?: true
    maxCapacity?: true
    floor?: true
    price?: true
    width?: true
    height?: true
    isCommon?: true
    zIndex?: true
    description?: true
    hasShower?: true
    hasToilet?: true
    pricePerPerson?: true
    textVertical?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoomMaxAggregateInputType = {
    id?: true
    number?: true
    hotelId?: true
    name?: true
    type?: true
    capacity?: true
    maxCapacity?: true
    floor?: true
    price?: true
    width?: true
    height?: true
    isCommon?: true
    zIndex?: true
    description?: true
    hasShower?: true
    hasToilet?: true
    pricePerPerson?: true
    textVertical?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoomCountAggregateInputType = {
    id?: true
    number?: true
    hotelId?: true
    name?: true
    type?: true
    capacity?: true
    maxCapacity?: true
    beds?: true
    floor?: true
    price?: true
    position?: true
    width?: true
    height?: true
    isCommon?: true
    zIndex?: true
    description?: true
    hasShower?: true
    hasToilet?: true
    pricePerPerson?: true
    textVertical?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RoomAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Room to aggregate.
     */
    where?: RoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rooms to fetch.
     */
    orderBy?: RoomOrderByWithRelationInput | RoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Rooms
    **/
    _count?: true | RoomCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RoomAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RoomSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoomMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoomMaxAggregateInputType
  }

  export type GetRoomAggregateType<T extends RoomAggregateArgs> = {
        [P in keyof T & keyof AggregateRoom]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoom[P]>
      : GetScalarType<T[P], AggregateRoom[P]>
  }




  export type RoomGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoomWhereInput
    orderBy?: RoomOrderByWithAggregationInput | RoomOrderByWithAggregationInput[]
    by: RoomScalarFieldEnum[] | RoomScalarFieldEnum
    having?: RoomScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoomCountAggregateInputType | true
    _avg?: RoomAvgAggregateInputType
    _sum?: RoomSumAggregateInputType
    _min?: RoomMinAggregateInputType
    _max?: RoomMaxAggregateInputType
  }

  export type RoomGroupByOutputType = {
    id: string
    number: string
    hotelId: string
    name: string | null
    type: $Enums.RoomType
    capacity: string
    maxCapacity: number
    beds: JsonValue
    floor: $Enums.FloorType
    price: Decimal
    position: JsonValue
    width: number | null
    height: number | null
    isCommon: boolean
    zIndex: number
    description: string | null
    hasShower: boolean
    hasToilet: boolean
    pricePerPerson: boolean
    textVertical: boolean
    createdAt: Date
    updatedAt: Date
    _count: RoomCountAggregateOutputType | null
    _avg: RoomAvgAggregateOutputType | null
    _sum: RoomSumAggregateOutputType | null
    _min: RoomMinAggregateOutputType | null
    _max: RoomMaxAggregateOutputType | null
  }

  type GetRoomGroupByPayload<T extends RoomGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoomGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoomGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoomGroupByOutputType[P]>
            : GetScalarType<T[P], RoomGroupByOutputType[P]>
        }
      >
    >


  export type RoomSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    number?: boolean
    hotelId?: boolean
    name?: boolean
    type?: boolean
    capacity?: boolean
    maxCapacity?: boolean
    beds?: boolean
    floor?: boolean
    price?: boolean
    position?: boolean
    width?: boolean
    height?: boolean
    isCommon?: boolean
    zIndex?: boolean
    description?: boolean
    hasShower?: boolean
    hasToilet?: boolean
    pricePerPerson?: boolean
    textVertical?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    hotel?: boolean | HotelDefaultArgs<ExtArgs>
    bookings?: boolean | Room$bookingsArgs<ExtArgs>
    _count?: boolean | RoomCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["room"]>

  export type RoomSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    number?: boolean
    hotelId?: boolean
    name?: boolean
    type?: boolean
    capacity?: boolean
    maxCapacity?: boolean
    beds?: boolean
    floor?: boolean
    price?: boolean
    position?: boolean
    width?: boolean
    height?: boolean
    isCommon?: boolean
    zIndex?: boolean
    description?: boolean
    hasShower?: boolean
    hasToilet?: boolean
    pricePerPerson?: boolean
    textVertical?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    hotel?: boolean | HotelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["room"]>

  export type RoomSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    number?: boolean
    hotelId?: boolean
    name?: boolean
    type?: boolean
    capacity?: boolean
    maxCapacity?: boolean
    beds?: boolean
    floor?: boolean
    price?: boolean
    position?: boolean
    width?: boolean
    height?: boolean
    isCommon?: boolean
    zIndex?: boolean
    description?: boolean
    hasShower?: boolean
    hasToilet?: boolean
    pricePerPerson?: boolean
    textVertical?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    hotel?: boolean | HotelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["room"]>

  export type RoomSelectScalar = {
    id?: boolean
    number?: boolean
    hotelId?: boolean
    name?: boolean
    type?: boolean
    capacity?: boolean
    maxCapacity?: boolean
    beds?: boolean
    floor?: boolean
    price?: boolean
    position?: boolean
    width?: boolean
    height?: boolean
    isCommon?: boolean
    zIndex?: boolean
    description?: boolean
    hasShower?: boolean
    hasToilet?: boolean
    pricePerPerson?: boolean
    textVertical?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RoomOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "number" | "hotelId" | "name" | "type" | "capacity" | "maxCapacity" | "beds" | "floor" | "price" | "position" | "width" | "height" | "isCommon" | "zIndex" | "description" | "hasShower" | "hasToilet" | "pricePerPerson" | "textVertical" | "createdAt" | "updatedAt", ExtArgs["result"]["room"]>
  export type RoomInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    hotel?: boolean | HotelDefaultArgs<ExtArgs>
    bookings?: boolean | Room$bookingsArgs<ExtArgs>
    _count?: boolean | RoomCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RoomIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    hotel?: boolean | HotelDefaultArgs<ExtArgs>
  }
  export type RoomIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    hotel?: boolean | HotelDefaultArgs<ExtArgs>
  }

  export type $RoomPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Room"
    objects: {
      hotel: Prisma.$HotelPayload<ExtArgs>
      bookings: Prisma.$BookingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      number: string
      hotelId: string
      name: string | null
      type: $Enums.RoomType
      capacity: string
      maxCapacity: number
      beds: Prisma.JsonValue
      floor: $Enums.FloorType
      price: Prisma.Decimal
      position: Prisma.JsonValue
      width: number | null
      height: number | null
      isCommon: boolean
      zIndex: number
      description: string | null
      hasShower: boolean
      hasToilet: boolean
      pricePerPerson: boolean
      textVertical: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["room"]>
    composites: {}
  }

  type RoomGetPayload<S extends boolean | null | undefined | RoomDefaultArgs> = $Result.GetResult<Prisma.$RoomPayload, S>

  type RoomCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoomFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoomCountAggregateInputType | true
    }

  export interface RoomDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Room'], meta: { name: 'Room' } }
    /**
     * Find zero or one Room that matches the filter.
     * @param {RoomFindUniqueArgs} args - Arguments to find a Room
     * @example
     * // Get one Room
     * const room = await prisma.room.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoomFindUniqueArgs>(args: SelectSubset<T, RoomFindUniqueArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Room that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoomFindUniqueOrThrowArgs} args - Arguments to find a Room
     * @example
     * // Get one Room
     * const room = await prisma.room.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoomFindUniqueOrThrowArgs>(args: SelectSubset<T, RoomFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Room that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomFindFirstArgs} args - Arguments to find a Room
     * @example
     * // Get one Room
     * const room = await prisma.room.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoomFindFirstArgs>(args?: SelectSubset<T, RoomFindFirstArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Room that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomFindFirstOrThrowArgs} args - Arguments to find a Room
     * @example
     * // Get one Room
     * const room = await prisma.room.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoomFindFirstOrThrowArgs>(args?: SelectSubset<T, RoomFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Rooms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Rooms
     * const rooms = await prisma.room.findMany()
     * 
     * // Get first 10 Rooms
     * const rooms = await prisma.room.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roomWithIdOnly = await prisma.room.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoomFindManyArgs>(args?: SelectSubset<T, RoomFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Room.
     * @param {RoomCreateArgs} args - Arguments to create a Room.
     * @example
     * // Create one Room
     * const Room = await prisma.room.create({
     *   data: {
     *     // ... data to create a Room
     *   }
     * })
     * 
     */
    create<T extends RoomCreateArgs>(args: SelectSubset<T, RoomCreateArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Rooms.
     * @param {RoomCreateManyArgs} args - Arguments to create many Rooms.
     * @example
     * // Create many Rooms
     * const room = await prisma.room.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoomCreateManyArgs>(args?: SelectSubset<T, RoomCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Rooms and returns the data saved in the database.
     * @param {RoomCreateManyAndReturnArgs} args - Arguments to create many Rooms.
     * @example
     * // Create many Rooms
     * const room = await prisma.room.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Rooms and only return the `id`
     * const roomWithIdOnly = await prisma.room.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoomCreateManyAndReturnArgs>(args?: SelectSubset<T, RoomCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Room.
     * @param {RoomDeleteArgs} args - Arguments to delete one Room.
     * @example
     * // Delete one Room
     * const Room = await prisma.room.delete({
     *   where: {
     *     // ... filter to delete one Room
     *   }
     * })
     * 
     */
    delete<T extends RoomDeleteArgs>(args: SelectSubset<T, RoomDeleteArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Room.
     * @param {RoomUpdateArgs} args - Arguments to update one Room.
     * @example
     * // Update one Room
     * const room = await prisma.room.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoomUpdateArgs>(args: SelectSubset<T, RoomUpdateArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Rooms.
     * @param {RoomDeleteManyArgs} args - Arguments to filter Rooms to delete.
     * @example
     * // Delete a few Rooms
     * const { count } = await prisma.room.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoomDeleteManyArgs>(args?: SelectSubset<T, RoomDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Rooms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Rooms
     * const room = await prisma.room.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoomUpdateManyArgs>(args: SelectSubset<T, RoomUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Rooms and returns the data updated in the database.
     * @param {RoomUpdateManyAndReturnArgs} args - Arguments to update many Rooms.
     * @example
     * // Update many Rooms
     * const room = await prisma.room.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Rooms and only return the `id`
     * const roomWithIdOnly = await prisma.room.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RoomUpdateManyAndReturnArgs>(args: SelectSubset<T, RoomUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Room.
     * @param {RoomUpsertArgs} args - Arguments to update or create a Room.
     * @example
     * // Update or create a Room
     * const room = await prisma.room.upsert({
     *   create: {
     *     // ... data to create a Room
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Room we want to update
     *   }
     * })
     */
    upsert<T extends RoomUpsertArgs>(args: SelectSubset<T, RoomUpsertArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Rooms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomCountArgs} args - Arguments to filter Rooms to count.
     * @example
     * // Count the number of Rooms
     * const count = await prisma.room.count({
     *   where: {
     *     // ... the filter for the Rooms we want to count
     *   }
     * })
    **/
    count<T extends RoomCountArgs>(
      args?: Subset<T, RoomCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoomCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Room.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoomAggregateArgs>(args: Subset<T, RoomAggregateArgs>): Prisma.PrismaPromise<GetRoomAggregateType<T>>

    /**
     * Group by Room.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoomGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoomGroupByArgs['orderBy'] }
        : { orderBy?: RoomGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoomGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoomGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Room model
   */
  readonly fields: RoomFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Room.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoomClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    hotel<T extends HotelDefaultArgs<ExtArgs> = {}>(args?: Subset<T, HotelDefaultArgs<ExtArgs>>): Prisma__HotelClient<$Result.GetResult<Prisma.$HotelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    bookings<T extends Room$bookingsArgs<ExtArgs> = {}>(args?: Subset<T, Room$bookingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Room model
   */
  interface RoomFieldRefs {
    readonly id: FieldRef<"Room", 'String'>
    readonly number: FieldRef<"Room", 'String'>
    readonly hotelId: FieldRef<"Room", 'String'>
    readonly name: FieldRef<"Room", 'String'>
    readonly type: FieldRef<"Room", 'RoomType'>
    readonly capacity: FieldRef<"Room", 'String'>
    readonly maxCapacity: FieldRef<"Room", 'Int'>
    readonly beds: FieldRef<"Room", 'Json'>
    readonly floor: FieldRef<"Room", 'FloorType'>
    readonly price: FieldRef<"Room", 'Decimal'>
    readonly position: FieldRef<"Room", 'Json'>
    readonly width: FieldRef<"Room", 'Int'>
    readonly height: FieldRef<"Room", 'Int'>
    readonly isCommon: FieldRef<"Room", 'Boolean'>
    readonly zIndex: FieldRef<"Room", 'Int'>
    readonly description: FieldRef<"Room", 'String'>
    readonly hasShower: FieldRef<"Room", 'Boolean'>
    readonly hasToilet: FieldRef<"Room", 'Boolean'>
    readonly pricePerPerson: FieldRef<"Room", 'Boolean'>
    readonly textVertical: FieldRef<"Room", 'Boolean'>
    readonly createdAt: FieldRef<"Room", 'DateTime'>
    readonly updatedAt: FieldRef<"Room", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Room findUnique
   */
  export type RoomFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * Filter, which Room to fetch.
     */
    where: RoomWhereUniqueInput
  }

  /**
   * Room findUniqueOrThrow
   */
  export type RoomFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * Filter, which Room to fetch.
     */
    where: RoomWhereUniqueInput
  }

  /**
   * Room findFirst
   */
  export type RoomFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * Filter, which Room to fetch.
     */
    where?: RoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rooms to fetch.
     */
    orderBy?: RoomOrderByWithRelationInput | RoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rooms.
     */
    cursor?: RoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rooms.
     */
    distinct?: RoomScalarFieldEnum | RoomScalarFieldEnum[]
  }

  /**
   * Room findFirstOrThrow
   */
  export type RoomFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * Filter, which Room to fetch.
     */
    where?: RoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rooms to fetch.
     */
    orderBy?: RoomOrderByWithRelationInput | RoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rooms.
     */
    cursor?: RoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rooms.
     */
    distinct?: RoomScalarFieldEnum | RoomScalarFieldEnum[]
  }

  /**
   * Room findMany
   */
  export type RoomFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * Filter, which Rooms to fetch.
     */
    where?: RoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rooms to fetch.
     */
    orderBy?: RoomOrderByWithRelationInput | RoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Rooms.
     */
    cursor?: RoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rooms.
     */
    skip?: number
    distinct?: RoomScalarFieldEnum | RoomScalarFieldEnum[]
  }

  /**
   * Room create
   */
  export type RoomCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * The data needed to create a Room.
     */
    data: XOR<RoomCreateInput, RoomUncheckedCreateInput>
  }

  /**
   * Room createMany
   */
  export type RoomCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Rooms.
     */
    data: RoomCreateManyInput | RoomCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Room createManyAndReturn
   */
  export type RoomCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * The data used to create many Rooms.
     */
    data: RoomCreateManyInput | RoomCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Room update
   */
  export type RoomUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * The data needed to update a Room.
     */
    data: XOR<RoomUpdateInput, RoomUncheckedUpdateInput>
    /**
     * Choose, which Room to update.
     */
    where: RoomWhereUniqueInput
  }

  /**
   * Room updateMany
   */
  export type RoomUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Rooms.
     */
    data: XOR<RoomUpdateManyMutationInput, RoomUncheckedUpdateManyInput>
    /**
     * Filter which Rooms to update
     */
    where?: RoomWhereInput
    /**
     * Limit how many Rooms to update.
     */
    limit?: number
  }

  /**
   * Room updateManyAndReturn
   */
  export type RoomUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * The data used to update Rooms.
     */
    data: XOR<RoomUpdateManyMutationInput, RoomUncheckedUpdateManyInput>
    /**
     * Filter which Rooms to update
     */
    where?: RoomWhereInput
    /**
     * Limit how many Rooms to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Room upsert
   */
  export type RoomUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * The filter to search for the Room to update in case it exists.
     */
    where: RoomWhereUniqueInput
    /**
     * In case the Room found by the `where` argument doesn't exist, create a new Room with this data.
     */
    create: XOR<RoomCreateInput, RoomUncheckedCreateInput>
    /**
     * In case the Room was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoomUpdateInput, RoomUncheckedUpdateInput>
  }

  /**
   * Room delete
   */
  export type RoomDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * Filter which Room to delete.
     */
    where: RoomWhereUniqueInput
  }

  /**
   * Room deleteMany
   */
  export type RoomDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Rooms to delete
     */
    where?: RoomWhereInput
    /**
     * Limit how many Rooms to delete.
     */
    limit?: number
  }

  /**
   * Room.bookings
   */
  export type Room$bookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    where?: BookingWhereInput
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    cursor?: BookingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Room without action
   */
  export type RoomDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
  }


  /**
   * Model Booking
   */

  export type AggregateBooking = {
    _count: BookingCountAggregateOutputType | null
    _avg: BookingAvgAggregateOutputType | null
    _sum: BookingSumAggregateOutputType | null
    _min: BookingMinAggregateOutputType | null
    _max: BookingMaxAggregateOutputType | null
  }

  export type BookingAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type BookingSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type BookingMinAggregateOutputType = {
    id: string | null
    roomId: string | null
    bookedBy: string | null
    bookedDate: Date | null
    email: string | null
    phone: string | null
    checkIn: Date | null
    checkOut: Date | null
    notes: string | null
    isConfirmed: boolean | null
    confirmedBy: string | null
    confirmedDate: Date | null
    isPaid: boolean | null
    paymentMethod: $Enums.PaymentMethod | null
    paymentDate: Date | null
    paidBy: string | null
    amount: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BookingMaxAggregateOutputType = {
    id: string | null
    roomId: string | null
    bookedBy: string | null
    bookedDate: Date | null
    email: string | null
    phone: string | null
    checkIn: Date | null
    checkOut: Date | null
    notes: string | null
    isConfirmed: boolean | null
    confirmedBy: string | null
    confirmedDate: Date | null
    isPaid: boolean | null
    paymentMethod: $Enums.PaymentMethod | null
    paymentDate: Date | null
    paidBy: string | null
    amount: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BookingCountAggregateOutputType = {
    id: number
    roomId: number
    bookedBy: number
    bookedDate: number
    email: number
    phone: number
    checkIn: number
    checkOut: number
    guests: number
    notes: number
    isConfirmed: number
    confirmedBy: number
    confirmedDate: number
    isPaid: number
    paymentMethod: number
    paymentDate: number
    paidBy: number
    amount: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BookingAvgAggregateInputType = {
    amount?: true
  }

  export type BookingSumAggregateInputType = {
    amount?: true
  }

  export type BookingMinAggregateInputType = {
    id?: true
    roomId?: true
    bookedBy?: true
    bookedDate?: true
    email?: true
    phone?: true
    checkIn?: true
    checkOut?: true
    notes?: true
    isConfirmed?: true
    confirmedBy?: true
    confirmedDate?: true
    isPaid?: true
    paymentMethod?: true
    paymentDate?: true
    paidBy?: true
    amount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BookingMaxAggregateInputType = {
    id?: true
    roomId?: true
    bookedBy?: true
    bookedDate?: true
    email?: true
    phone?: true
    checkIn?: true
    checkOut?: true
    notes?: true
    isConfirmed?: true
    confirmedBy?: true
    confirmedDate?: true
    isPaid?: true
    paymentMethod?: true
    paymentDate?: true
    paidBy?: true
    amount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BookingCountAggregateInputType = {
    id?: true
    roomId?: true
    bookedBy?: true
    bookedDate?: true
    email?: true
    phone?: true
    checkIn?: true
    checkOut?: true
    guests?: true
    notes?: true
    isConfirmed?: true
    confirmedBy?: true
    confirmedDate?: true
    isPaid?: true
    paymentMethod?: true
    paymentDate?: true
    paidBy?: true
    amount?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BookingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Booking to aggregate.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Bookings
    **/
    _count?: true | BookingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BookingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BookingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookingMaxAggregateInputType
  }

  export type GetBookingAggregateType<T extends BookingAggregateArgs> = {
        [P in keyof T & keyof AggregateBooking]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBooking[P]>
      : GetScalarType<T[P], AggregateBooking[P]>
  }




  export type BookingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingWhereInput
    orderBy?: BookingOrderByWithAggregationInput | BookingOrderByWithAggregationInput[]
    by: BookingScalarFieldEnum[] | BookingScalarFieldEnum
    having?: BookingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookingCountAggregateInputType | true
    _avg?: BookingAvgAggregateInputType
    _sum?: BookingSumAggregateInputType
    _min?: BookingMinAggregateInputType
    _max?: BookingMaxAggregateInputType
  }

  export type BookingGroupByOutputType = {
    id: string
    roomId: string
    bookedBy: string
    bookedDate: Date
    email: string | null
    phone: string
    checkIn: Date
    checkOut: Date
    guests: JsonValue
    notes: string | null
    isConfirmed: boolean
    confirmedBy: string | null
    confirmedDate: Date | null
    isPaid: boolean
    paymentMethod: $Enums.PaymentMethod | null
    paymentDate: Date | null
    paidBy: string | null
    amount: Decimal | null
    createdAt: Date
    updatedAt: Date
    _count: BookingCountAggregateOutputType | null
    _avg: BookingAvgAggregateOutputType | null
    _sum: BookingSumAggregateOutputType | null
    _min: BookingMinAggregateOutputType | null
    _max: BookingMaxAggregateOutputType | null
  }

  type GetBookingGroupByPayload<T extends BookingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookingGroupByOutputType[P]>
            : GetScalarType<T[P], BookingGroupByOutputType[P]>
        }
      >
    >


  export type BookingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roomId?: boolean
    bookedBy?: boolean
    bookedDate?: boolean
    email?: boolean
    phone?: boolean
    checkIn?: boolean
    checkOut?: boolean
    guests?: boolean
    notes?: boolean
    isConfirmed?: boolean
    confirmedBy?: boolean
    confirmedDate?: boolean
    isPaid?: boolean
    paymentMethod?: boolean
    paymentDate?: boolean
    paidBy?: boolean
    amount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    room?: boolean | RoomDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["booking"]>

  export type BookingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roomId?: boolean
    bookedBy?: boolean
    bookedDate?: boolean
    email?: boolean
    phone?: boolean
    checkIn?: boolean
    checkOut?: boolean
    guests?: boolean
    notes?: boolean
    isConfirmed?: boolean
    confirmedBy?: boolean
    confirmedDate?: boolean
    isPaid?: boolean
    paymentMethod?: boolean
    paymentDate?: boolean
    paidBy?: boolean
    amount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    room?: boolean | RoomDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["booking"]>

  export type BookingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roomId?: boolean
    bookedBy?: boolean
    bookedDate?: boolean
    email?: boolean
    phone?: boolean
    checkIn?: boolean
    checkOut?: boolean
    guests?: boolean
    notes?: boolean
    isConfirmed?: boolean
    confirmedBy?: boolean
    confirmedDate?: boolean
    isPaid?: boolean
    paymentMethod?: boolean
    paymentDate?: boolean
    paidBy?: boolean
    amount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    room?: boolean | RoomDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["booking"]>

  export type BookingSelectScalar = {
    id?: boolean
    roomId?: boolean
    bookedBy?: boolean
    bookedDate?: boolean
    email?: boolean
    phone?: boolean
    checkIn?: boolean
    checkOut?: boolean
    guests?: boolean
    notes?: boolean
    isConfirmed?: boolean
    confirmedBy?: boolean
    confirmedDate?: boolean
    isPaid?: boolean
    paymentMethod?: boolean
    paymentDate?: boolean
    paidBy?: boolean
    amount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BookingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "roomId" | "bookedBy" | "bookedDate" | "email" | "phone" | "checkIn" | "checkOut" | "guests" | "notes" | "isConfirmed" | "confirmedBy" | "confirmedDate" | "isPaid" | "paymentMethod" | "paymentDate" | "paidBy" | "amount" | "createdAt" | "updatedAt", ExtArgs["result"]["booking"]>
  export type BookingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    room?: boolean | RoomDefaultArgs<ExtArgs>
  }
  export type BookingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    room?: boolean | RoomDefaultArgs<ExtArgs>
  }
  export type BookingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    room?: boolean | RoomDefaultArgs<ExtArgs>
  }

  export type $BookingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Booking"
    objects: {
      room: Prisma.$RoomPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      roomId: string
      bookedBy: string
      bookedDate: Date
      email: string | null
      phone: string
      checkIn: Date
      checkOut: Date
      guests: Prisma.JsonValue
      notes: string | null
      isConfirmed: boolean
      confirmedBy: string | null
      confirmedDate: Date | null
      isPaid: boolean
      paymentMethod: $Enums.PaymentMethod | null
      paymentDate: Date | null
      paidBy: string | null
      amount: Prisma.Decimal | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["booking"]>
    composites: {}
  }

  type BookingGetPayload<S extends boolean | null | undefined | BookingDefaultArgs> = $Result.GetResult<Prisma.$BookingPayload, S>

  type BookingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BookingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BookingCountAggregateInputType | true
    }

  export interface BookingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Booking'], meta: { name: 'Booking' } }
    /**
     * Find zero or one Booking that matches the filter.
     * @param {BookingFindUniqueArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BookingFindUniqueArgs>(args: SelectSubset<T, BookingFindUniqueArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Booking that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BookingFindUniqueOrThrowArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BookingFindUniqueOrThrowArgs>(args: SelectSubset<T, BookingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Booking that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingFindFirstArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BookingFindFirstArgs>(args?: SelectSubset<T, BookingFindFirstArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Booking that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingFindFirstOrThrowArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BookingFindFirstOrThrowArgs>(args?: SelectSubset<T, BookingFindFirstOrThrowArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Bookings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Bookings
     * const bookings = await prisma.booking.findMany()
     * 
     * // Get first 10 Bookings
     * const bookings = await prisma.booking.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookingWithIdOnly = await prisma.booking.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BookingFindManyArgs>(args?: SelectSubset<T, BookingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Booking.
     * @param {BookingCreateArgs} args - Arguments to create a Booking.
     * @example
     * // Create one Booking
     * const Booking = await prisma.booking.create({
     *   data: {
     *     // ... data to create a Booking
     *   }
     * })
     * 
     */
    create<T extends BookingCreateArgs>(args: SelectSubset<T, BookingCreateArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Bookings.
     * @param {BookingCreateManyArgs} args - Arguments to create many Bookings.
     * @example
     * // Create many Bookings
     * const booking = await prisma.booking.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BookingCreateManyArgs>(args?: SelectSubset<T, BookingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Bookings and returns the data saved in the database.
     * @param {BookingCreateManyAndReturnArgs} args - Arguments to create many Bookings.
     * @example
     * // Create many Bookings
     * const booking = await prisma.booking.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Bookings and only return the `id`
     * const bookingWithIdOnly = await prisma.booking.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BookingCreateManyAndReturnArgs>(args?: SelectSubset<T, BookingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Booking.
     * @param {BookingDeleteArgs} args - Arguments to delete one Booking.
     * @example
     * // Delete one Booking
     * const Booking = await prisma.booking.delete({
     *   where: {
     *     // ... filter to delete one Booking
     *   }
     * })
     * 
     */
    delete<T extends BookingDeleteArgs>(args: SelectSubset<T, BookingDeleteArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Booking.
     * @param {BookingUpdateArgs} args - Arguments to update one Booking.
     * @example
     * // Update one Booking
     * const booking = await prisma.booking.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BookingUpdateArgs>(args: SelectSubset<T, BookingUpdateArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Bookings.
     * @param {BookingDeleteManyArgs} args - Arguments to filter Bookings to delete.
     * @example
     * // Delete a few Bookings
     * const { count } = await prisma.booking.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BookingDeleteManyArgs>(args?: SelectSubset<T, BookingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bookings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Bookings
     * const booking = await prisma.booking.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BookingUpdateManyArgs>(args: SelectSubset<T, BookingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bookings and returns the data updated in the database.
     * @param {BookingUpdateManyAndReturnArgs} args - Arguments to update many Bookings.
     * @example
     * // Update many Bookings
     * const booking = await prisma.booking.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Bookings and only return the `id`
     * const bookingWithIdOnly = await prisma.booking.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BookingUpdateManyAndReturnArgs>(args: SelectSubset<T, BookingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Booking.
     * @param {BookingUpsertArgs} args - Arguments to update or create a Booking.
     * @example
     * // Update or create a Booking
     * const booking = await prisma.booking.upsert({
     *   create: {
     *     // ... data to create a Booking
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Booking we want to update
     *   }
     * })
     */
    upsert<T extends BookingUpsertArgs>(args: SelectSubset<T, BookingUpsertArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Bookings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingCountArgs} args - Arguments to filter Bookings to count.
     * @example
     * // Count the number of Bookings
     * const count = await prisma.booking.count({
     *   where: {
     *     // ... the filter for the Bookings we want to count
     *   }
     * })
    **/
    count<T extends BookingCountArgs>(
      args?: Subset<T, BookingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Booking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BookingAggregateArgs>(args: Subset<T, BookingAggregateArgs>): Prisma.PrismaPromise<GetBookingAggregateType<T>>

    /**
     * Group by Booking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BookingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BookingGroupByArgs['orderBy'] }
        : { orderBy?: BookingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BookingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Booking model
   */
  readonly fields: BookingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Booking.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BookingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    room<T extends RoomDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoomDefaultArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Booking model
   */
  interface BookingFieldRefs {
    readonly id: FieldRef<"Booking", 'String'>
    readonly roomId: FieldRef<"Booking", 'String'>
    readonly bookedBy: FieldRef<"Booking", 'String'>
    readonly bookedDate: FieldRef<"Booking", 'DateTime'>
    readonly email: FieldRef<"Booking", 'String'>
    readonly phone: FieldRef<"Booking", 'String'>
    readonly checkIn: FieldRef<"Booking", 'DateTime'>
    readonly checkOut: FieldRef<"Booking", 'DateTime'>
    readonly guests: FieldRef<"Booking", 'Json'>
    readonly notes: FieldRef<"Booking", 'String'>
    readonly isConfirmed: FieldRef<"Booking", 'Boolean'>
    readonly confirmedBy: FieldRef<"Booking", 'String'>
    readonly confirmedDate: FieldRef<"Booking", 'DateTime'>
    readonly isPaid: FieldRef<"Booking", 'Boolean'>
    readonly paymentMethod: FieldRef<"Booking", 'PaymentMethod'>
    readonly paymentDate: FieldRef<"Booking", 'DateTime'>
    readonly paidBy: FieldRef<"Booking", 'String'>
    readonly amount: FieldRef<"Booking", 'Decimal'>
    readonly createdAt: FieldRef<"Booking", 'DateTime'>
    readonly updatedAt: FieldRef<"Booking", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Booking findUnique
   */
  export type BookingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking findUniqueOrThrow
   */
  export type BookingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking findFirst
   */
  export type BookingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bookings.
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bookings.
     */
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Booking findFirstOrThrow
   */
  export type BookingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bookings.
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bookings.
     */
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Booking findMany
   */
  export type BookingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Bookings to fetch.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Bookings.
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Booking create
   */
  export type BookingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * The data needed to create a Booking.
     */
    data: XOR<BookingCreateInput, BookingUncheckedCreateInput>
  }

  /**
   * Booking createMany
   */
  export type BookingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Bookings.
     */
    data: BookingCreateManyInput | BookingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Booking createManyAndReturn
   */
  export type BookingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * The data used to create many Bookings.
     */
    data: BookingCreateManyInput | BookingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Booking update
   */
  export type BookingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * The data needed to update a Booking.
     */
    data: XOR<BookingUpdateInput, BookingUncheckedUpdateInput>
    /**
     * Choose, which Booking to update.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking updateMany
   */
  export type BookingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Bookings.
     */
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyInput>
    /**
     * Filter which Bookings to update
     */
    where?: BookingWhereInput
    /**
     * Limit how many Bookings to update.
     */
    limit?: number
  }

  /**
   * Booking updateManyAndReturn
   */
  export type BookingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * The data used to update Bookings.
     */
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyInput>
    /**
     * Filter which Bookings to update
     */
    where?: BookingWhereInput
    /**
     * Limit how many Bookings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Booking upsert
   */
  export type BookingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * The filter to search for the Booking to update in case it exists.
     */
    where: BookingWhereUniqueInput
    /**
     * In case the Booking found by the `where` argument doesn't exist, create a new Booking with this data.
     */
    create: XOR<BookingCreateInput, BookingUncheckedCreateInput>
    /**
     * In case the Booking was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BookingUpdateInput, BookingUncheckedUpdateInput>
  }

  /**
   * Booking delete
   */
  export type BookingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter which Booking to delete.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking deleteMany
   */
  export type BookingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bookings to delete
     */
    where?: BookingWhereInput
    /**
     * Limit how many Bookings to delete.
     */
    limit?: number
  }

  /**
   * Booking without action
   */
  export type BookingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
  }


  /**
   * Model Stairs
   */

  export type AggregateStairs = {
    _count: StairsCountAggregateOutputType | null
    _avg: StairsAvgAggregateOutputType | null
    _sum: StairsSumAggregateOutputType | null
    _min: StairsMinAggregateOutputType | null
    _max: StairsMaxAggregateOutputType | null
  }

  export type StairsAvgAggregateOutputType = {
    width: number | null
    height: number | null
  }

  export type StairsSumAggregateOutputType = {
    width: number | null
    height: number | null
  }

  export type StairsMinAggregateOutputType = {
    id: string | null
    hotelId: string | null
    floor: $Enums.FloorType | null
    width: number | null
    height: number | null
    direction: $Enums.StairsDirection | null
    targetFloor: $Enums.FloorType | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StairsMaxAggregateOutputType = {
    id: string | null
    hotelId: string | null
    floor: $Enums.FloorType | null
    width: number | null
    height: number | null
    direction: $Enums.StairsDirection | null
    targetFloor: $Enums.FloorType | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StairsCountAggregateOutputType = {
    id: number
    hotelId: number
    floor: number
    position: number
    width: number
    height: number
    direction: number
    targetFloor: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type StairsAvgAggregateInputType = {
    width?: true
    height?: true
  }

  export type StairsSumAggregateInputType = {
    width?: true
    height?: true
  }

  export type StairsMinAggregateInputType = {
    id?: true
    hotelId?: true
    floor?: true
    width?: true
    height?: true
    direction?: true
    targetFloor?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StairsMaxAggregateInputType = {
    id?: true
    hotelId?: true
    floor?: true
    width?: true
    height?: true
    direction?: true
    targetFloor?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StairsCountAggregateInputType = {
    id?: true
    hotelId?: true
    floor?: true
    position?: true
    width?: true
    height?: true
    direction?: true
    targetFloor?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type StairsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Stairs to aggregate.
     */
    where?: StairsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Stairs to fetch.
     */
    orderBy?: StairsOrderByWithRelationInput | StairsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StairsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Stairs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Stairs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Stairs
    **/
    _count?: true | StairsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StairsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StairsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StairsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StairsMaxAggregateInputType
  }

  export type GetStairsAggregateType<T extends StairsAggregateArgs> = {
        [P in keyof T & keyof AggregateStairs]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStairs[P]>
      : GetScalarType<T[P], AggregateStairs[P]>
  }




  export type StairsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StairsWhereInput
    orderBy?: StairsOrderByWithAggregationInput | StairsOrderByWithAggregationInput[]
    by: StairsScalarFieldEnum[] | StairsScalarFieldEnum
    having?: StairsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StairsCountAggregateInputType | true
    _avg?: StairsAvgAggregateInputType
    _sum?: StairsSumAggregateInputType
    _min?: StairsMinAggregateInputType
    _max?: StairsMaxAggregateInputType
  }

  export type StairsGroupByOutputType = {
    id: string
    hotelId: string
    floor: $Enums.FloorType
    position: JsonValue
    width: number
    height: number
    direction: $Enums.StairsDirection
    targetFloor: $Enums.FloorType | null
    createdAt: Date
    updatedAt: Date
    _count: StairsCountAggregateOutputType | null
    _avg: StairsAvgAggregateOutputType | null
    _sum: StairsSumAggregateOutputType | null
    _min: StairsMinAggregateOutputType | null
    _max: StairsMaxAggregateOutputType | null
  }

  type GetStairsGroupByPayload<T extends StairsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StairsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StairsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StairsGroupByOutputType[P]>
            : GetScalarType<T[P], StairsGroupByOutputType[P]>
        }
      >
    >


  export type StairsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    hotelId?: boolean
    floor?: boolean
    position?: boolean
    width?: boolean
    height?: boolean
    direction?: boolean
    targetFloor?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    hotel?: boolean | HotelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stairs"]>

  export type StairsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    hotelId?: boolean
    floor?: boolean
    position?: boolean
    width?: boolean
    height?: boolean
    direction?: boolean
    targetFloor?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    hotel?: boolean | HotelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stairs"]>

  export type StairsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    hotelId?: boolean
    floor?: boolean
    position?: boolean
    width?: boolean
    height?: boolean
    direction?: boolean
    targetFloor?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    hotel?: boolean | HotelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stairs"]>

  export type StairsSelectScalar = {
    id?: boolean
    hotelId?: boolean
    floor?: boolean
    position?: boolean
    width?: boolean
    height?: boolean
    direction?: boolean
    targetFloor?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type StairsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "hotelId" | "floor" | "position" | "width" | "height" | "direction" | "targetFloor" | "createdAt" | "updatedAt", ExtArgs["result"]["stairs"]>
  export type StairsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    hotel?: boolean | HotelDefaultArgs<ExtArgs>
  }
  export type StairsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    hotel?: boolean | HotelDefaultArgs<ExtArgs>
  }
  export type StairsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    hotel?: boolean | HotelDefaultArgs<ExtArgs>
  }

  export type $StairsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Stairs"
    objects: {
      hotel: Prisma.$HotelPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      hotelId: string
      floor: $Enums.FloorType
      position: Prisma.JsonValue
      width: number
      height: number
      direction: $Enums.StairsDirection
      targetFloor: $Enums.FloorType | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["stairs"]>
    composites: {}
  }

  type StairsGetPayload<S extends boolean | null | undefined | StairsDefaultArgs> = $Result.GetResult<Prisma.$StairsPayload, S>

  type StairsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StairsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StairsCountAggregateInputType | true
    }

  export interface StairsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Stairs'], meta: { name: 'Stairs' } }
    /**
     * Find zero or one Stairs that matches the filter.
     * @param {StairsFindUniqueArgs} args - Arguments to find a Stairs
     * @example
     * // Get one Stairs
     * const stairs = await prisma.stairs.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StairsFindUniqueArgs>(args: SelectSubset<T, StairsFindUniqueArgs<ExtArgs>>): Prisma__StairsClient<$Result.GetResult<Prisma.$StairsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Stairs that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StairsFindUniqueOrThrowArgs} args - Arguments to find a Stairs
     * @example
     * // Get one Stairs
     * const stairs = await prisma.stairs.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StairsFindUniqueOrThrowArgs>(args: SelectSubset<T, StairsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StairsClient<$Result.GetResult<Prisma.$StairsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Stairs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StairsFindFirstArgs} args - Arguments to find a Stairs
     * @example
     * // Get one Stairs
     * const stairs = await prisma.stairs.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StairsFindFirstArgs>(args?: SelectSubset<T, StairsFindFirstArgs<ExtArgs>>): Prisma__StairsClient<$Result.GetResult<Prisma.$StairsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Stairs that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StairsFindFirstOrThrowArgs} args - Arguments to find a Stairs
     * @example
     * // Get one Stairs
     * const stairs = await prisma.stairs.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StairsFindFirstOrThrowArgs>(args?: SelectSubset<T, StairsFindFirstOrThrowArgs<ExtArgs>>): Prisma__StairsClient<$Result.GetResult<Prisma.$StairsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Stairs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StairsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Stairs
     * const stairs = await prisma.stairs.findMany()
     * 
     * // Get first 10 Stairs
     * const stairs = await prisma.stairs.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const stairsWithIdOnly = await prisma.stairs.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StairsFindManyArgs>(args?: SelectSubset<T, StairsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StairsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Stairs.
     * @param {StairsCreateArgs} args - Arguments to create a Stairs.
     * @example
     * // Create one Stairs
     * const Stairs = await prisma.stairs.create({
     *   data: {
     *     // ... data to create a Stairs
     *   }
     * })
     * 
     */
    create<T extends StairsCreateArgs>(args: SelectSubset<T, StairsCreateArgs<ExtArgs>>): Prisma__StairsClient<$Result.GetResult<Prisma.$StairsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Stairs.
     * @param {StairsCreateManyArgs} args - Arguments to create many Stairs.
     * @example
     * // Create many Stairs
     * const stairs = await prisma.stairs.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StairsCreateManyArgs>(args?: SelectSubset<T, StairsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Stairs and returns the data saved in the database.
     * @param {StairsCreateManyAndReturnArgs} args - Arguments to create many Stairs.
     * @example
     * // Create many Stairs
     * const stairs = await prisma.stairs.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Stairs and only return the `id`
     * const stairsWithIdOnly = await prisma.stairs.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StairsCreateManyAndReturnArgs>(args?: SelectSubset<T, StairsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StairsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Stairs.
     * @param {StairsDeleteArgs} args - Arguments to delete one Stairs.
     * @example
     * // Delete one Stairs
     * const Stairs = await prisma.stairs.delete({
     *   where: {
     *     // ... filter to delete one Stairs
     *   }
     * })
     * 
     */
    delete<T extends StairsDeleteArgs>(args: SelectSubset<T, StairsDeleteArgs<ExtArgs>>): Prisma__StairsClient<$Result.GetResult<Prisma.$StairsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Stairs.
     * @param {StairsUpdateArgs} args - Arguments to update one Stairs.
     * @example
     * // Update one Stairs
     * const stairs = await prisma.stairs.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StairsUpdateArgs>(args: SelectSubset<T, StairsUpdateArgs<ExtArgs>>): Prisma__StairsClient<$Result.GetResult<Prisma.$StairsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Stairs.
     * @param {StairsDeleteManyArgs} args - Arguments to filter Stairs to delete.
     * @example
     * // Delete a few Stairs
     * const { count } = await prisma.stairs.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StairsDeleteManyArgs>(args?: SelectSubset<T, StairsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Stairs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StairsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Stairs
     * const stairs = await prisma.stairs.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StairsUpdateManyArgs>(args: SelectSubset<T, StairsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Stairs and returns the data updated in the database.
     * @param {StairsUpdateManyAndReturnArgs} args - Arguments to update many Stairs.
     * @example
     * // Update many Stairs
     * const stairs = await prisma.stairs.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Stairs and only return the `id`
     * const stairsWithIdOnly = await prisma.stairs.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StairsUpdateManyAndReturnArgs>(args: SelectSubset<T, StairsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StairsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Stairs.
     * @param {StairsUpsertArgs} args - Arguments to update or create a Stairs.
     * @example
     * // Update or create a Stairs
     * const stairs = await prisma.stairs.upsert({
     *   create: {
     *     // ... data to create a Stairs
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Stairs we want to update
     *   }
     * })
     */
    upsert<T extends StairsUpsertArgs>(args: SelectSubset<T, StairsUpsertArgs<ExtArgs>>): Prisma__StairsClient<$Result.GetResult<Prisma.$StairsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Stairs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StairsCountArgs} args - Arguments to filter Stairs to count.
     * @example
     * // Count the number of Stairs
     * const count = await prisma.stairs.count({
     *   where: {
     *     // ... the filter for the Stairs we want to count
     *   }
     * })
    **/
    count<T extends StairsCountArgs>(
      args?: Subset<T, StairsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StairsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Stairs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StairsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StairsAggregateArgs>(args: Subset<T, StairsAggregateArgs>): Prisma.PrismaPromise<GetStairsAggregateType<T>>

    /**
     * Group by Stairs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StairsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StairsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StairsGroupByArgs['orderBy'] }
        : { orderBy?: StairsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StairsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStairsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Stairs model
   */
  readonly fields: StairsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Stairs.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StairsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    hotel<T extends HotelDefaultArgs<ExtArgs> = {}>(args?: Subset<T, HotelDefaultArgs<ExtArgs>>): Prisma__HotelClient<$Result.GetResult<Prisma.$HotelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Stairs model
   */
  interface StairsFieldRefs {
    readonly id: FieldRef<"Stairs", 'String'>
    readonly hotelId: FieldRef<"Stairs", 'String'>
    readonly floor: FieldRef<"Stairs", 'FloorType'>
    readonly position: FieldRef<"Stairs", 'Json'>
    readonly width: FieldRef<"Stairs", 'Int'>
    readonly height: FieldRef<"Stairs", 'Int'>
    readonly direction: FieldRef<"Stairs", 'StairsDirection'>
    readonly targetFloor: FieldRef<"Stairs", 'FloorType'>
    readonly createdAt: FieldRef<"Stairs", 'DateTime'>
    readonly updatedAt: FieldRef<"Stairs", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Stairs findUnique
   */
  export type StairsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stairs
     */
    select?: StairsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Stairs
     */
    omit?: StairsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StairsInclude<ExtArgs> | null
    /**
     * Filter, which Stairs to fetch.
     */
    where: StairsWhereUniqueInput
  }

  /**
   * Stairs findUniqueOrThrow
   */
  export type StairsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stairs
     */
    select?: StairsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Stairs
     */
    omit?: StairsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StairsInclude<ExtArgs> | null
    /**
     * Filter, which Stairs to fetch.
     */
    where: StairsWhereUniqueInput
  }

  /**
   * Stairs findFirst
   */
  export type StairsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stairs
     */
    select?: StairsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Stairs
     */
    omit?: StairsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StairsInclude<ExtArgs> | null
    /**
     * Filter, which Stairs to fetch.
     */
    where?: StairsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Stairs to fetch.
     */
    orderBy?: StairsOrderByWithRelationInput | StairsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Stairs.
     */
    cursor?: StairsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Stairs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Stairs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Stairs.
     */
    distinct?: StairsScalarFieldEnum | StairsScalarFieldEnum[]
  }

  /**
   * Stairs findFirstOrThrow
   */
  export type StairsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stairs
     */
    select?: StairsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Stairs
     */
    omit?: StairsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StairsInclude<ExtArgs> | null
    /**
     * Filter, which Stairs to fetch.
     */
    where?: StairsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Stairs to fetch.
     */
    orderBy?: StairsOrderByWithRelationInput | StairsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Stairs.
     */
    cursor?: StairsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Stairs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Stairs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Stairs.
     */
    distinct?: StairsScalarFieldEnum | StairsScalarFieldEnum[]
  }

  /**
   * Stairs findMany
   */
  export type StairsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stairs
     */
    select?: StairsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Stairs
     */
    omit?: StairsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StairsInclude<ExtArgs> | null
    /**
     * Filter, which Stairs to fetch.
     */
    where?: StairsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Stairs to fetch.
     */
    orderBy?: StairsOrderByWithRelationInput | StairsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Stairs.
     */
    cursor?: StairsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Stairs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Stairs.
     */
    skip?: number
    distinct?: StairsScalarFieldEnum | StairsScalarFieldEnum[]
  }

  /**
   * Stairs create
   */
  export type StairsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stairs
     */
    select?: StairsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Stairs
     */
    omit?: StairsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StairsInclude<ExtArgs> | null
    /**
     * The data needed to create a Stairs.
     */
    data: XOR<StairsCreateInput, StairsUncheckedCreateInput>
  }

  /**
   * Stairs createMany
   */
  export type StairsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Stairs.
     */
    data: StairsCreateManyInput | StairsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Stairs createManyAndReturn
   */
  export type StairsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stairs
     */
    select?: StairsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Stairs
     */
    omit?: StairsOmit<ExtArgs> | null
    /**
     * The data used to create many Stairs.
     */
    data: StairsCreateManyInput | StairsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StairsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Stairs update
   */
  export type StairsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stairs
     */
    select?: StairsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Stairs
     */
    omit?: StairsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StairsInclude<ExtArgs> | null
    /**
     * The data needed to update a Stairs.
     */
    data: XOR<StairsUpdateInput, StairsUncheckedUpdateInput>
    /**
     * Choose, which Stairs to update.
     */
    where: StairsWhereUniqueInput
  }

  /**
   * Stairs updateMany
   */
  export type StairsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Stairs.
     */
    data: XOR<StairsUpdateManyMutationInput, StairsUncheckedUpdateManyInput>
    /**
     * Filter which Stairs to update
     */
    where?: StairsWhereInput
    /**
     * Limit how many Stairs to update.
     */
    limit?: number
  }

  /**
   * Stairs updateManyAndReturn
   */
  export type StairsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stairs
     */
    select?: StairsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Stairs
     */
    omit?: StairsOmit<ExtArgs> | null
    /**
     * The data used to update Stairs.
     */
    data: XOR<StairsUpdateManyMutationInput, StairsUncheckedUpdateManyInput>
    /**
     * Filter which Stairs to update
     */
    where?: StairsWhereInput
    /**
     * Limit how many Stairs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StairsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Stairs upsert
   */
  export type StairsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stairs
     */
    select?: StairsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Stairs
     */
    omit?: StairsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StairsInclude<ExtArgs> | null
    /**
     * The filter to search for the Stairs to update in case it exists.
     */
    where: StairsWhereUniqueInput
    /**
     * In case the Stairs found by the `where` argument doesn't exist, create a new Stairs with this data.
     */
    create: XOR<StairsCreateInput, StairsUncheckedCreateInput>
    /**
     * In case the Stairs was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StairsUpdateInput, StairsUncheckedUpdateInput>
  }

  /**
   * Stairs delete
   */
  export type StairsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stairs
     */
    select?: StairsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Stairs
     */
    omit?: StairsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StairsInclude<ExtArgs> | null
    /**
     * Filter which Stairs to delete.
     */
    where: StairsWhereUniqueInput
  }

  /**
   * Stairs deleteMany
   */
  export type StairsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Stairs to delete
     */
    where?: StairsWhereInput
    /**
     * Limit how many Stairs to delete.
     */
    limit?: number
  }

  /**
   * Stairs without action
   */
  export type StairsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stairs
     */
    select?: StairsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Stairs
     */
    omit?: StairsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StairsInclude<ExtArgs> | null
  }


  /**
   * Model Invite
   */

  export type AggregateInvite = {
    _count: InviteCountAggregateOutputType | null
    _min: InviteMinAggregateOutputType | null
    _max: InviteMaxAggregateOutputType | null
  }

  export type InviteMinAggregateOutputType = {
    id: string | null
    token: string | null
    createdBy: string | null
    createdAt: Date | null
    expiresAt: Date | null
    used: boolean | null
    name: string | null
    usedBy: string | null
    usedAt: Date | null
  }

  export type InviteMaxAggregateOutputType = {
    id: string | null
    token: string | null
    createdBy: string | null
    createdAt: Date | null
    expiresAt: Date | null
    used: boolean | null
    name: string | null
    usedBy: string | null
    usedAt: Date | null
  }

  export type InviteCountAggregateOutputType = {
    id: number
    token: number
    createdBy: number
    createdAt: number
    expiresAt: number
    used: number
    name: number
    usedBy: number
    usedAt: number
    _all: number
  }


  export type InviteMinAggregateInputType = {
    id?: true
    token?: true
    createdBy?: true
    createdAt?: true
    expiresAt?: true
    used?: true
    name?: true
    usedBy?: true
    usedAt?: true
  }

  export type InviteMaxAggregateInputType = {
    id?: true
    token?: true
    createdBy?: true
    createdAt?: true
    expiresAt?: true
    used?: true
    name?: true
    usedBy?: true
    usedAt?: true
  }

  export type InviteCountAggregateInputType = {
    id?: true
    token?: true
    createdBy?: true
    createdAt?: true
    expiresAt?: true
    used?: true
    name?: true
    usedBy?: true
    usedAt?: true
    _all?: true
  }

  export type InviteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invite to aggregate.
     */
    where?: InviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invites to fetch.
     */
    orderBy?: InviteOrderByWithRelationInput | InviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Invites
    **/
    _count?: true | InviteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InviteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InviteMaxAggregateInputType
  }

  export type GetInviteAggregateType<T extends InviteAggregateArgs> = {
        [P in keyof T & keyof AggregateInvite]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvite[P]>
      : GetScalarType<T[P], AggregateInvite[P]>
  }




  export type InviteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InviteWhereInput
    orderBy?: InviteOrderByWithAggregationInput | InviteOrderByWithAggregationInput[]
    by: InviteScalarFieldEnum[] | InviteScalarFieldEnum
    having?: InviteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InviteCountAggregateInputType | true
    _min?: InviteMinAggregateInputType
    _max?: InviteMaxAggregateInputType
  }

  export type InviteGroupByOutputType = {
    id: string
    token: string
    createdBy: string
    createdAt: Date
    expiresAt: Date
    used: boolean
    name: string
    usedBy: string | null
    usedAt: Date | null
    _count: InviteCountAggregateOutputType | null
    _min: InviteMinAggregateOutputType | null
    _max: InviteMaxAggregateOutputType | null
  }

  type GetInviteGroupByPayload<T extends InviteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InviteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InviteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InviteGroupByOutputType[P]>
            : GetScalarType<T[P], InviteGroupByOutputType[P]>
        }
      >
    >


  export type InviteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    createdBy?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    used?: boolean
    name?: boolean
    usedBy?: boolean
    usedAt?: boolean
    creator?: boolean | Invite$creatorArgs<ExtArgs>
    user?: boolean | Invite$userArgs<ExtArgs>
  }, ExtArgs["result"]["invite"]>

  export type InviteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    createdBy?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    used?: boolean
    name?: boolean
    usedBy?: boolean
    usedAt?: boolean
    creator?: boolean | Invite$creatorArgs<ExtArgs>
    user?: boolean | Invite$userArgs<ExtArgs>
  }, ExtArgs["result"]["invite"]>

  export type InviteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    createdBy?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    used?: boolean
    name?: boolean
    usedBy?: boolean
    usedAt?: boolean
    creator?: boolean | Invite$creatorArgs<ExtArgs>
    user?: boolean | Invite$userArgs<ExtArgs>
  }, ExtArgs["result"]["invite"]>

  export type InviteSelectScalar = {
    id?: boolean
    token?: boolean
    createdBy?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    used?: boolean
    name?: boolean
    usedBy?: boolean
    usedAt?: boolean
  }

  export type InviteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "token" | "createdBy" | "createdAt" | "expiresAt" | "used" | "name" | "usedBy" | "usedAt", ExtArgs["result"]["invite"]>
  export type InviteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | Invite$creatorArgs<ExtArgs>
    user?: boolean | Invite$userArgs<ExtArgs>
  }
  export type InviteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | Invite$creatorArgs<ExtArgs>
    user?: boolean | Invite$userArgs<ExtArgs>
  }
  export type InviteIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | Invite$creatorArgs<ExtArgs>
    user?: boolean | Invite$userArgs<ExtArgs>
  }

  export type $InvitePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Invite"
    objects: {
      creator: Prisma.$UserPayload<ExtArgs> | null
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      token: string
      createdBy: string
      createdAt: Date
      expiresAt: Date
      used: boolean
      name: string
      usedBy: string | null
      usedAt: Date | null
    }, ExtArgs["result"]["invite"]>
    composites: {}
  }

  type InviteGetPayload<S extends boolean | null | undefined | InviteDefaultArgs> = $Result.GetResult<Prisma.$InvitePayload, S>

  type InviteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InviteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InviteCountAggregateInputType | true
    }

  export interface InviteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Invite'], meta: { name: 'Invite' } }
    /**
     * Find zero or one Invite that matches the filter.
     * @param {InviteFindUniqueArgs} args - Arguments to find a Invite
     * @example
     * // Get one Invite
     * const invite = await prisma.invite.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InviteFindUniqueArgs>(args: SelectSubset<T, InviteFindUniqueArgs<ExtArgs>>): Prisma__InviteClient<$Result.GetResult<Prisma.$InvitePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Invite that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InviteFindUniqueOrThrowArgs} args - Arguments to find a Invite
     * @example
     * // Get one Invite
     * const invite = await prisma.invite.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InviteFindUniqueOrThrowArgs>(args: SelectSubset<T, InviteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InviteClient<$Result.GetResult<Prisma.$InvitePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Invite that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InviteFindFirstArgs} args - Arguments to find a Invite
     * @example
     * // Get one Invite
     * const invite = await prisma.invite.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InviteFindFirstArgs>(args?: SelectSubset<T, InviteFindFirstArgs<ExtArgs>>): Prisma__InviteClient<$Result.GetResult<Prisma.$InvitePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Invite that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InviteFindFirstOrThrowArgs} args - Arguments to find a Invite
     * @example
     * // Get one Invite
     * const invite = await prisma.invite.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InviteFindFirstOrThrowArgs>(args?: SelectSubset<T, InviteFindFirstOrThrowArgs<ExtArgs>>): Prisma__InviteClient<$Result.GetResult<Prisma.$InvitePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Invites that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InviteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Invites
     * const invites = await prisma.invite.findMany()
     * 
     * // Get first 10 Invites
     * const invites = await prisma.invite.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inviteWithIdOnly = await prisma.invite.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InviteFindManyArgs>(args?: SelectSubset<T, InviteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Invite.
     * @param {InviteCreateArgs} args - Arguments to create a Invite.
     * @example
     * // Create one Invite
     * const Invite = await prisma.invite.create({
     *   data: {
     *     // ... data to create a Invite
     *   }
     * })
     * 
     */
    create<T extends InviteCreateArgs>(args: SelectSubset<T, InviteCreateArgs<ExtArgs>>): Prisma__InviteClient<$Result.GetResult<Prisma.$InvitePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Invites.
     * @param {InviteCreateManyArgs} args - Arguments to create many Invites.
     * @example
     * // Create many Invites
     * const invite = await prisma.invite.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InviteCreateManyArgs>(args?: SelectSubset<T, InviteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Invites and returns the data saved in the database.
     * @param {InviteCreateManyAndReturnArgs} args - Arguments to create many Invites.
     * @example
     * // Create many Invites
     * const invite = await prisma.invite.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Invites and only return the `id`
     * const inviteWithIdOnly = await prisma.invite.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InviteCreateManyAndReturnArgs>(args?: SelectSubset<T, InviteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvitePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Invite.
     * @param {InviteDeleteArgs} args - Arguments to delete one Invite.
     * @example
     * // Delete one Invite
     * const Invite = await prisma.invite.delete({
     *   where: {
     *     // ... filter to delete one Invite
     *   }
     * })
     * 
     */
    delete<T extends InviteDeleteArgs>(args: SelectSubset<T, InviteDeleteArgs<ExtArgs>>): Prisma__InviteClient<$Result.GetResult<Prisma.$InvitePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Invite.
     * @param {InviteUpdateArgs} args - Arguments to update one Invite.
     * @example
     * // Update one Invite
     * const invite = await prisma.invite.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InviteUpdateArgs>(args: SelectSubset<T, InviteUpdateArgs<ExtArgs>>): Prisma__InviteClient<$Result.GetResult<Prisma.$InvitePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Invites.
     * @param {InviteDeleteManyArgs} args - Arguments to filter Invites to delete.
     * @example
     * // Delete a few Invites
     * const { count } = await prisma.invite.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InviteDeleteManyArgs>(args?: SelectSubset<T, InviteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Invites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InviteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Invites
     * const invite = await prisma.invite.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InviteUpdateManyArgs>(args: SelectSubset<T, InviteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Invites and returns the data updated in the database.
     * @param {InviteUpdateManyAndReturnArgs} args - Arguments to update many Invites.
     * @example
     * // Update many Invites
     * const invite = await prisma.invite.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Invites and only return the `id`
     * const inviteWithIdOnly = await prisma.invite.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends InviteUpdateManyAndReturnArgs>(args: SelectSubset<T, InviteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvitePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Invite.
     * @param {InviteUpsertArgs} args - Arguments to update or create a Invite.
     * @example
     * // Update or create a Invite
     * const invite = await prisma.invite.upsert({
     *   create: {
     *     // ... data to create a Invite
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Invite we want to update
     *   }
     * })
     */
    upsert<T extends InviteUpsertArgs>(args: SelectSubset<T, InviteUpsertArgs<ExtArgs>>): Prisma__InviteClient<$Result.GetResult<Prisma.$InvitePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Invites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InviteCountArgs} args - Arguments to filter Invites to count.
     * @example
     * // Count the number of Invites
     * const count = await prisma.invite.count({
     *   where: {
     *     // ... the filter for the Invites we want to count
     *   }
     * })
    **/
    count<T extends InviteCountArgs>(
      args?: Subset<T, InviteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InviteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Invite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InviteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InviteAggregateArgs>(args: Subset<T, InviteAggregateArgs>): Prisma.PrismaPromise<GetInviteAggregateType<T>>

    /**
     * Group by Invite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InviteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InviteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InviteGroupByArgs['orderBy'] }
        : { orderBy?: InviteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InviteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInviteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Invite model
   */
  readonly fields: InviteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Invite.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InviteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    creator<T extends Invite$creatorArgs<ExtArgs> = {}>(args?: Subset<T, Invite$creatorArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    user<T extends Invite$userArgs<ExtArgs> = {}>(args?: Subset<T, Invite$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Invite model
   */
  interface InviteFieldRefs {
    readonly id: FieldRef<"Invite", 'String'>
    readonly token: FieldRef<"Invite", 'String'>
    readonly createdBy: FieldRef<"Invite", 'String'>
    readonly createdAt: FieldRef<"Invite", 'DateTime'>
    readonly expiresAt: FieldRef<"Invite", 'DateTime'>
    readonly used: FieldRef<"Invite", 'Boolean'>
    readonly name: FieldRef<"Invite", 'String'>
    readonly usedBy: FieldRef<"Invite", 'String'>
    readonly usedAt: FieldRef<"Invite", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Invite findUnique
   */
  export type InviteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invite
     */
    select?: InviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invite
     */
    omit?: InviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InviteInclude<ExtArgs> | null
    /**
     * Filter, which Invite to fetch.
     */
    where: InviteWhereUniqueInput
  }

  /**
   * Invite findUniqueOrThrow
   */
  export type InviteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invite
     */
    select?: InviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invite
     */
    omit?: InviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InviteInclude<ExtArgs> | null
    /**
     * Filter, which Invite to fetch.
     */
    where: InviteWhereUniqueInput
  }

  /**
   * Invite findFirst
   */
  export type InviteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invite
     */
    select?: InviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invite
     */
    omit?: InviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InviteInclude<ExtArgs> | null
    /**
     * Filter, which Invite to fetch.
     */
    where?: InviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invites to fetch.
     */
    orderBy?: InviteOrderByWithRelationInput | InviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invites.
     */
    cursor?: InviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invites.
     */
    distinct?: InviteScalarFieldEnum | InviteScalarFieldEnum[]
  }

  /**
   * Invite findFirstOrThrow
   */
  export type InviteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invite
     */
    select?: InviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invite
     */
    omit?: InviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InviteInclude<ExtArgs> | null
    /**
     * Filter, which Invite to fetch.
     */
    where?: InviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invites to fetch.
     */
    orderBy?: InviteOrderByWithRelationInput | InviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invites.
     */
    cursor?: InviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invites.
     */
    distinct?: InviteScalarFieldEnum | InviteScalarFieldEnum[]
  }

  /**
   * Invite findMany
   */
  export type InviteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invite
     */
    select?: InviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invite
     */
    omit?: InviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InviteInclude<ExtArgs> | null
    /**
     * Filter, which Invites to fetch.
     */
    where?: InviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invites to fetch.
     */
    orderBy?: InviteOrderByWithRelationInput | InviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Invites.
     */
    cursor?: InviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invites.
     */
    skip?: number
    distinct?: InviteScalarFieldEnum | InviteScalarFieldEnum[]
  }

  /**
   * Invite create
   */
  export type InviteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invite
     */
    select?: InviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invite
     */
    omit?: InviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InviteInclude<ExtArgs> | null
    /**
     * The data needed to create a Invite.
     */
    data: XOR<InviteCreateInput, InviteUncheckedCreateInput>
  }

  /**
   * Invite createMany
   */
  export type InviteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Invites.
     */
    data: InviteCreateManyInput | InviteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Invite createManyAndReturn
   */
  export type InviteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invite
     */
    select?: InviteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Invite
     */
    omit?: InviteOmit<ExtArgs> | null
    /**
     * The data used to create many Invites.
     */
    data: InviteCreateManyInput | InviteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InviteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Invite update
   */
  export type InviteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invite
     */
    select?: InviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invite
     */
    omit?: InviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InviteInclude<ExtArgs> | null
    /**
     * The data needed to update a Invite.
     */
    data: XOR<InviteUpdateInput, InviteUncheckedUpdateInput>
    /**
     * Choose, which Invite to update.
     */
    where: InviteWhereUniqueInput
  }

  /**
   * Invite updateMany
   */
  export type InviteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Invites.
     */
    data: XOR<InviteUpdateManyMutationInput, InviteUncheckedUpdateManyInput>
    /**
     * Filter which Invites to update
     */
    where?: InviteWhereInput
    /**
     * Limit how many Invites to update.
     */
    limit?: number
  }

  /**
   * Invite updateManyAndReturn
   */
  export type InviteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invite
     */
    select?: InviteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Invite
     */
    omit?: InviteOmit<ExtArgs> | null
    /**
     * The data used to update Invites.
     */
    data: XOR<InviteUpdateManyMutationInput, InviteUncheckedUpdateManyInput>
    /**
     * Filter which Invites to update
     */
    where?: InviteWhereInput
    /**
     * Limit how many Invites to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InviteIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Invite upsert
   */
  export type InviteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invite
     */
    select?: InviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invite
     */
    omit?: InviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InviteInclude<ExtArgs> | null
    /**
     * The filter to search for the Invite to update in case it exists.
     */
    where: InviteWhereUniqueInput
    /**
     * In case the Invite found by the `where` argument doesn't exist, create a new Invite with this data.
     */
    create: XOR<InviteCreateInput, InviteUncheckedCreateInput>
    /**
     * In case the Invite was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InviteUpdateInput, InviteUncheckedUpdateInput>
  }

  /**
   * Invite delete
   */
  export type InviteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invite
     */
    select?: InviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invite
     */
    omit?: InviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InviteInclude<ExtArgs> | null
    /**
     * Filter which Invite to delete.
     */
    where: InviteWhereUniqueInput
  }

  /**
   * Invite deleteMany
   */
  export type InviteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invites to delete
     */
    where?: InviteWhereInput
    /**
     * Limit how many Invites to delete.
     */
    limit?: number
  }

  /**
   * Invite.creator
   */
  export type Invite$creatorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Invite.user
   */
  export type Invite$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Invite without action
   */
  export type InviteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invite
     */
    select?: InviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invite
     */
    omit?: InviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InviteInclude<ExtArgs> | null
  }


  /**
   * Model Feedback
   */

  export type AggregateFeedback = {
    _count: FeedbackCountAggregateOutputType | null
    _min: FeedbackMinAggregateOutputType | null
    _max: FeedbackMaxAggregateOutputType | null
  }

  export type FeedbackMinAggregateOutputType = {
    id: string | null
    userName: string | null
    userEmail: string | null
    userRole: string | null
    comment: string | null
    screenshot: string | null
    userAgent: string | null
    isProcessed: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FeedbackMaxAggregateOutputType = {
    id: string | null
    userName: string | null
    userEmail: string | null
    userRole: string | null
    comment: string | null
    screenshot: string | null
    userAgent: string | null
    isProcessed: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FeedbackCountAggregateOutputType = {
    id: number
    userName: number
    userEmail: number
    userRole: number
    comment: number
    screenshot: number
    userAgent: number
    isProcessed: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FeedbackMinAggregateInputType = {
    id?: true
    userName?: true
    userEmail?: true
    userRole?: true
    comment?: true
    screenshot?: true
    userAgent?: true
    isProcessed?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FeedbackMaxAggregateInputType = {
    id?: true
    userName?: true
    userEmail?: true
    userRole?: true
    comment?: true
    screenshot?: true
    userAgent?: true
    isProcessed?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FeedbackCountAggregateInputType = {
    id?: true
    userName?: true
    userEmail?: true
    userRole?: true
    comment?: true
    screenshot?: true
    userAgent?: true
    isProcessed?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FeedbackAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Feedback to aggregate.
     */
    where?: FeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Feedbacks to fetch.
     */
    orderBy?: FeedbackOrderByWithRelationInput | FeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Feedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Feedbacks
    **/
    _count?: true | FeedbackCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FeedbackMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FeedbackMaxAggregateInputType
  }

  export type GetFeedbackAggregateType<T extends FeedbackAggregateArgs> = {
        [P in keyof T & keyof AggregateFeedback]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFeedback[P]>
      : GetScalarType<T[P], AggregateFeedback[P]>
  }




  export type FeedbackGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FeedbackWhereInput
    orderBy?: FeedbackOrderByWithAggregationInput | FeedbackOrderByWithAggregationInput[]
    by: FeedbackScalarFieldEnum[] | FeedbackScalarFieldEnum
    having?: FeedbackScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FeedbackCountAggregateInputType | true
    _min?: FeedbackMinAggregateInputType
    _max?: FeedbackMaxAggregateInputType
  }

  export type FeedbackGroupByOutputType = {
    id: string
    userName: string
    userEmail: string | null
    userRole: string
    comment: string
    screenshot: string | null
    userAgent: string | null
    isProcessed: boolean
    createdAt: Date
    updatedAt: Date
    _count: FeedbackCountAggregateOutputType | null
    _min: FeedbackMinAggregateOutputType | null
    _max: FeedbackMaxAggregateOutputType | null
  }

  type GetFeedbackGroupByPayload<T extends FeedbackGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FeedbackGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FeedbackGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FeedbackGroupByOutputType[P]>
            : GetScalarType<T[P], FeedbackGroupByOutputType[P]>
        }
      >
    >


  export type FeedbackSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userName?: boolean
    userEmail?: boolean
    userRole?: boolean
    comment?: boolean
    screenshot?: boolean
    userAgent?: boolean
    isProcessed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["feedback"]>

  export type FeedbackSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userName?: boolean
    userEmail?: boolean
    userRole?: boolean
    comment?: boolean
    screenshot?: boolean
    userAgent?: boolean
    isProcessed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["feedback"]>

  export type FeedbackSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userName?: boolean
    userEmail?: boolean
    userRole?: boolean
    comment?: boolean
    screenshot?: boolean
    userAgent?: boolean
    isProcessed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["feedback"]>

  export type FeedbackSelectScalar = {
    id?: boolean
    userName?: boolean
    userEmail?: boolean
    userRole?: boolean
    comment?: boolean
    screenshot?: boolean
    userAgent?: boolean
    isProcessed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FeedbackOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userName" | "userEmail" | "userRole" | "comment" | "screenshot" | "userAgent" | "isProcessed" | "createdAt" | "updatedAt", ExtArgs["result"]["feedback"]>

  export type $FeedbackPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Feedback"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userName: string
      userEmail: string | null
      userRole: string
      comment: string
      screenshot: string | null
      userAgent: string | null
      isProcessed: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["feedback"]>
    composites: {}
  }

  type FeedbackGetPayload<S extends boolean | null | undefined | FeedbackDefaultArgs> = $Result.GetResult<Prisma.$FeedbackPayload, S>

  type FeedbackCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FeedbackFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FeedbackCountAggregateInputType | true
    }

  export interface FeedbackDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Feedback'], meta: { name: 'Feedback' } }
    /**
     * Find zero or one Feedback that matches the filter.
     * @param {FeedbackFindUniqueArgs} args - Arguments to find a Feedback
     * @example
     * // Get one Feedback
     * const feedback = await prisma.feedback.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FeedbackFindUniqueArgs>(args: SelectSubset<T, FeedbackFindUniqueArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Feedback that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FeedbackFindUniqueOrThrowArgs} args - Arguments to find a Feedback
     * @example
     * // Get one Feedback
     * const feedback = await prisma.feedback.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FeedbackFindUniqueOrThrowArgs>(args: SelectSubset<T, FeedbackFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Feedback that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackFindFirstArgs} args - Arguments to find a Feedback
     * @example
     * // Get one Feedback
     * const feedback = await prisma.feedback.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FeedbackFindFirstArgs>(args?: SelectSubset<T, FeedbackFindFirstArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Feedback that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackFindFirstOrThrowArgs} args - Arguments to find a Feedback
     * @example
     * // Get one Feedback
     * const feedback = await prisma.feedback.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FeedbackFindFirstOrThrowArgs>(args?: SelectSubset<T, FeedbackFindFirstOrThrowArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Feedbacks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Feedbacks
     * const feedbacks = await prisma.feedback.findMany()
     * 
     * // Get first 10 Feedbacks
     * const feedbacks = await prisma.feedback.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const feedbackWithIdOnly = await prisma.feedback.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FeedbackFindManyArgs>(args?: SelectSubset<T, FeedbackFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Feedback.
     * @param {FeedbackCreateArgs} args - Arguments to create a Feedback.
     * @example
     * // Create one Feedback
     * const Feedback = await prisma.feedback.create({
     *   data: {
     *     // ... data to create a Feedback
     *   }
     * })
     * 
     */
    create<T extends FeedbackCreateArgs>(args: SelectSubset<T, FeedbackCreateArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Feedbacks.
     * @param {FeedbackCreateManyArgs} args - Arguments to create many Feedbacks.
     * @example
     * // Create many Feedbacks
     * const feedback = await prisma.feedback.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FeedbackCreateManyArgs>(args?: SelectSubset<T, FeedbackCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Feedbacks and returns the data saved in the database.
     * @param {FeedbackCreateManyAndReturnArgs} args - Arguments to create many Feedbacks.
     * @example
     * // Create many Feedbacks
     * const feedback = await prisma.feedback.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Feedbacks and only return the `id`
     * const feedbackWithIdOnly = await prisma.feedback.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FeedbackCreateManyAndReturnArgs>(args?: SelectSubset<T, FeedbackCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Feedback.
     * @param {FeedbackDeleteArgs} args - Arguments to delete one Feedback.
     * @example
     * // Delete one Feedback
     * const Feedback = await prisma.feedback.delete({
     *   where: {
     *     // ... filter to delete one Feedback
     *   }
     * })
     * 
     */
    delete<T extends FeedbackDeleteArgs>(args: SelectSubset<T, FeedbackDeleteArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Feedback.
     * @param {FeedbackUpdateArgs} args - Arguments to update one Feedback.
     * @example
     * // Update one Feedback
     * const feedback = await prisma.feedback.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FeedbackUpdateArgs>(args: SelectSubset<T, FeedbackUpdateArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Feedbacks.
     * @param {FeedbackDeleteManyArgs} args - Arguments to filter Feedbacks to delete.
     * @example
     * // Delete a few Feedbacks
     * const { count } = await prisma.feedback.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FeedbackDeleteManyArgs>(args?: SelectSubset<T, FeedbackDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Feedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Feedbacks
     * const feedback = await prisma.feedback.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FeedbackUpdateManyArgs>(args: SelectSubset<T, FeedbackUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Feedbacks and returns the data updated in the database.
     * @param {FeedbackUpdateManyAndReturnArgs} args - Arguments to update many Feedbacks.
     * @example
     * // Update many Feedbacks
     * const feedback = await prisma.feedback.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Feedbacks and only return the `id`
     * const feedbackWithIdOnly = await prisma.feedback.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FeedbackUpdateManyAndReturnArgs>(args: SelectSubset<T, FeedbackUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Feedback.
     * @param {FeedbackUpsertArgs} args - Arguments to update or create a Feedback.
     * @example
     * // Update or create a Feedback
     * const feedback = await prisma.feedback.upsert({
     *   create: {
     *     // ... data to create a Feedback
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Feedback we want to update
     *   }
     * })
     */
    upsert<T extends FeedbackUpsertArgs>(args: SelectSubset<T, FeedbackUpsertArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Feedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackCountArgs} args - Arguments to filter Feedbacks to count.
     * @example
     * // Count the number of Feedbacks
     * const count = await prisma.feedback.count({
     *   where: {
     *     // ... the filter for the Feedbacks we want to count
     *   }
     * })
    **/
    count<T extends FeedbackCountArgs>(
      args?: Subset<T, FeedbackCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FeedbackCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Feedback.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FeedbackAggregateArgs>(args: Subset<T, FeedbackAggregateArgs>): Prisma.PrismaPromise<GetFeedbackAggregateType<T>>

    /**
     * Group by Feedback.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FeedbackGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FeedbackGroupByArgs['orderBy'] }
        : { orderBy?: FeedbackGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FeedbackGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFeedbackGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Feedback model
   */
  readonly fields: FeedbackFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Feedback.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FeedbackClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Feedback model
   */
  interface FeedbackFieldRefs {
    readonly id: FieldRef<"Feedback", 'String'>
    readonly userName: FieldRef<"Feedback", 'String'>
    readonly userEmail: FieldRef<"Feedback", 'String'>
    readonly userRole: FieldRef<"Feedback", 'String'>
    readonly comment: FieldRef<"Feedback", 'String'>
    readonly screenshot: FieldRef<"Feedback", 'String'>
    readonly userAgent: FieldRef<"Feedback", 'String'>
    readonly isProcessed: FieldRef<"Feedback", 'Boolean'>
    readonly createdAt: FieldRef<"Feedback", 'DateTime'>
    readonly updatedAt: FieldRef<"Feedback", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Feedback findUnique
   */
  export type FeedbackFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Filter, which Feedback to fetch.
     */
    where: FeedbackWhereUniqueInput
  }

  /**
   * Feedback findUniqueOrThrow
   */
  export type FeedbackFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Filter, which Feedback to fetch.
     */
    where: FeedbackWhereUniqueInput
  }

  /**
   * Feedback findFirst
   */
  export type FeedbackFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Filter, which Feedback to fetch.
     */
    where?: FeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Feedbacks to fetch.
     */
    orderBy?: FeedbackOrderByWithRelationInput | FeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Feedbacks.
     */
    cursor?: FeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Feedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Feedbacks.
     */
    distinct?: FeedbackScalarFieldEnum | FeedbackScalarFieldEnum[]
  }

  /**
   * Feedback findFirstOrThrow
   */
  export type FeedbackFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Filter, which Feedback to fetch.
     */
    where?: FeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Feedbacks to fetch.
     */
    orderBy?: FeedbackOrderByWithRelationInput | FeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Feedbacks.
     */
    cursor?: FeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Feedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Feedbacks.
     */
    distinct?: FeedbackScalarFieldEnum | FeedbackScalarFieldEnum[]
  }

  /**
   * Feedback findMany
   */
  export type FeedbackFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Filter, which Feedbacks to fetch.
     */
    where?: FeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Feedbacks to fetch.
     */
    orderBy?: FeedbackOrderByWithRelationInput | FeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Feedbacks.
     */
    cursor?: FeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Feedbacks.
     */
    skip?: number
    distinct?: FeedbackScalarFieldEnum | FeedbackScalarFieldEnum[]
  }

  /**
   * Feedback create
   */
  export type FeedbackCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * The data needed to create a Feedback.
     */
    data: XOR<FeedbackCreateInput, FeedbackUncheckedCreateInput>
  }

  /**
   * Feedback createMany
   */
  export type FeedbackCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Feedbacks.
     */
    data: FeedbackCreateManyInput | FeedbackCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Feedback createManyAndReturn
   */
  export type FeedbackCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * The data used to create many Feedbacks.
     */
    data: FeedbackCreateManyInput | FeedbackCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Feedback update
   */
  export type FeedbackUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * The data needed to update a Feedback.
     */
    data: XOR<FeedbackUpdateInput, FeedbackUncheckedUpdateInput>
    /**
     * Choose, which Feedback to update.
     */
    where: FeedbackWhereUniqueInput
  }

  /**
   * Feedback updateMany
   */
  export type FeedbackUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Feedbacks.
     */
    data: XOR<FeedbackUpdateManyMutationInput, FeedbackUncheckedUpdateManyInput>
    /**
     * Filter which Feedbacks to update
     */
    where?: FeedbackWhereInput
    /**
     * Limit how many Feedbacks to update.
     */
    limit?: number
  }

  /**
   * Feedback updateManyAndReturn
   */
  export type FeedbackUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * The data used to update Feedbacks.
     */
    data: XOR<FeedbackUpdateManyMutationInput, FeedbackUncheckedUpdateManyInput>
    /**
     * Filter which Feedbacks to update
     */
    where?: FeedbackWhereInput
    /**
     * Limit how many Feedbacks to update.
     */
    limit?: number
  }

  /**
   * Feedback upsert
   */
  export type FeedbackUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * The filter to search for the Feedback to update in case it exists.
     */
    where: FeedbackWhereUniqueInput
    /**
     * In case the Feedback found by the `where` argument doesn't exist, create a new Feedback with this data.
     */
    create: XOR<FeedbackCreateInput, FeedbackUncheckedCreateInput>
    /**
     * In case the Feedback was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FeedbackUpdateInput, FeedbackUncheckedUpdateInput>
  }

  /**
   * Feedback delete
   */
  export type FeedbackDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Filter which Feedback to delete.
     */
    where: FeedbackWhereUniqueInput
  }

  /**
   * Feedback deleteMany
   */
  export type FeedbackDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Feedbacks to delete
     */
    where?: FeedbackWhereInput
    /**
     * Limit how many Feedbacks to delete.
     */
    limit?: number
  }

  /**
   * Feedback without action
   */
  export type FeedbackDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
  }


  /**
   * Model RegistrationToken
   */

  export type AggregateRegistrationToken = {
    _count: RegistrationTokenCountAggregateOutputType | null
    _min: RegistrationTokenMinAggregateOutputType | null
    _max: RegistrationTokenMaxAggregateOutputType | null
  }

  export type RegistrationTokenMinAggregateOutputType = {
    id: string | null
    token: string | null
    originalToken: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RegistrationTokenMaxAggregateOutputType = {
    id: string | null
    token: string | null
    originalToken: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RegistrationTokenCountAggregateOutputType = {
    id: number
    token: number
    originalToken: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RegistrationTokenMinAggregateInputType = {
    id?: true
    token?: true
    originalToken?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RegistrationTokenMaxAggregateInputType = {
    id?: true
    token?: true
    originalToken?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RegistrationTokenCountAggregateInputType = {
    id?: true
    token?: true
    originalToken?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RegistrationTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RegistrationToken to aggregate.
     */
    where?: RegistrationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RegistrationTokens to fetch.
     */
    orderBy?: RegistrationTokenOrderByWithRelationInput | RegistrationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RegistrationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RegistrationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RegistrationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RegistrationTokens
    **/
    _count?: true | RegistrationTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RegistrationTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RegistrationTokenMaxAggregateInputType
  }

  export type GetRegistrationTokenAggregateType<T extends RegistrationTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateRegistrationToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRegistrationToken[P]>
      : GetScalarType<T[P], AggregateRegistrationToken[P]>
  }




  export type RegistrationTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RegistrationTokenWhereInput
    orderBy?: RegistrationTokenOrderByWithAggregationInput | RegistrationTokenOrderByWithAggregationInput[]
    by: RegistrationTokenScalarFieldEnum[] | RegistrationTokenScalarFieldEnum
    having?: RegistrationTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RegistrationTokenCountAggregateInputType | true
    _min?: RegistrationTokenMinAggregateInputType
    _max?: RegistrationTokenMaxAggregateInputType
  }

  export type RegistrationTokenGroupByOutputType = {
    id: string
    token: string
    originalToken: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: RegistrationTokenCountAggregateOutputType | null
    _min: RegistrationTokenMinAggregateOutputType | null
    _max: RegistrationTokenMaxAggregateOutputType | null
  }

  type GetRegistrationTokenGroupByPayload<T extends RegistrationTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RegistrationTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RegistrationTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RegistrationTokenGroupByOutputType[P]>
            : GetScalarType<T[P], RegistrationTokenGroupByOutputType[P]>
        }
      >
    >


  export type RegistrationTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    originalToken?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["registrationToken"]>

  export type RegistrationTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    originalToken?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["registrationToken"]>

  export type RegistrationTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    originalToken?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["registrationToken"]>

  export type RegistrationTokenSelectScalar = {
    id?: boolean
    token?: boolean
    originalToken?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RegistrationTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "token" | "originalToken" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["registrationToken"]>

  export type $RegistrationTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RegistrationToken"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      token: string
      originalToken: string | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["registrationToken"]>
    composites: {}
  }

  type RegistrationTokenGetPayload<S extends boolean | null | undefined | RegistrationTokenDefaultArgs> = $Result.GetResult<Prisma.$RegistrationTokenPayload, S>

  type RegistrationTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RegistrationTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RegistrationTokenCountAggregateInputType | true
    }

  export interface RegistrationTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RegistrationToken'], meta: { name: 'RegistrationToken' } }
    /**
     * Find zero or one RegistrationToken that matches the filter.
     * @param {RegistrationTokenFindUniqueArgs} args - Arguments to find a RegistrationToken
     * @example
     * // Get one RegistrationToken
     * const registrationToken = await prisma.registrationToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RegistrationTokenFindUniqueArgs>(args: SelectSubset<T, RegistrationTokenFindUniqueArgs<ExtArgs>>): Prisma__RegistrationTokenClient<$Result.GetResult<Prisma.$RegistrationTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RegistrationToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RegistrationTokenFindUniqueOrThrowArgs} args - Arguments to find a RegistrationToken
     * @example
     * // Get one RegistrationToken
     * const registrationToken = await prisma.registrationToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RegistrationTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, RegistrationTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RegistrationTokenClient<$Result.GetResult<Prisma.$RegistrationTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RegistrationToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationTokenFindFirstArgs} args - Arguments to find a RegistrationToken
     * @example
     * // Get one RegistrationToken
     * const registrationToken = await prisma.registrationToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RegistrationTokenFindFirstArgs>(args?: SelectSubset<T, RegistrationTokenFindFirstArgs<ExtArgs>>): Prisma__RegistrationTokenClient<$Result.GetResult<Prisma.$RegistrationTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RegistrationToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationTokenFindFirstOrThrowArgs} args - Arguments to find a RegistrationToken
     * @example
     * // Get one RegistrationToken
     * const registrationToken = await prisma.registrationToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RegistrationTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, RegistrationTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__RegistrationTokenClient<$Result.GetResult<Prisma.$RegistrationTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RegistrationTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RegistrationTokens
     * const registrationTokens = await prisma.registrationToken.findMany()
     * 
     * // Get first 10 RegistrationTokens
     * const registrationTokens = await prisma.registrationToken.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const registrationTokenWithIdOnly = await prisma.registrationToken.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RegistrationTokenFindManyArgs>(args?: SelectSubset<T, RegistrationTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RegistrationTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RegistrationToken.
     * @param {RegistrationTokenCreateArgs} args - Arguments to create a RegistrationToken.
     * @example
     * // Create one RegistrationToken
     * const RegistrationToken = await prisma.registrationToken.create({
     *   data: {
     *     // ... data to create a RegistrationToken
     *   }
     * })
     * 
     */
    create<T extends RegistrationTokenCreateArgs>(args: SelectSubset<T, RegistrationTokenCreateArgs<ExtArgs>>): Prisma__RegistrationTokenClient<$Result.GetResult<Prisma.$RegistrationTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RegistrationTokens.
     * @param {RegistrationTokenCreateManyArgs} args - Arguments to create many RegistrationTokens.
     * @example
     * // Create many RegistrationTokens
     * const registrationToken = await prisma.registrationToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RegistrationTokenCreateManyArgs>(args?: SelectSubset<T, RegistrationTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RegistrationTokens and returns the data saved in the database.
     * @param {RegistrationTokenCreateManyAndReturnArgs} args - Arguments to create many RegistrationTokens.
     * @example
     * // Create many RegistrationTokens
     * const registrationToken = await prisma.registrationToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RegistrationTokens and only return the `id`
     * const registrationTokenWithIdOnly = await prisma.registrationToken.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RegistrationTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, RegistrationTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RegistrationTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RegistrationToken.
     * @param {RegistrationTokenDeleteArgs} args - Arguments to delete one RegistrationToken.
     * @example
     * // Delete one RegistrationToken
     * const RegistrationToken = await prisma.registrationToken.delete({
     *   where: {
     *     // ... filter to delete one RegistrationToken
     *   }
     * })
     * 
     */
    delete<T extends RegistrationTokenDeleteArgs>(args: SelectSubset<T, RegistrationTokenDeleteArgs<ExtArgs>>): Prisma__RegistrationTokenClient<$Result.GetResult<Prisma.$RegistrationTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RegistrationToken.
     * @param {RegistrationTokenUpdateArgs} args - Arguments to update one RegistrationToken.
     * @example
     * // Update one RegistrationToken
     * const registrationToken = await prisma.registrationToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RegistrationTokenUpdateArgs>(args: SelectSubset<T, RegistrationTokenUpdateArgs<ExtArgs>>): Prisma__RegistrationTokenClient<$Result.GetResult<Prisma.$RegistrationTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RegistrationTokens.
     * @param {RegistrationTokenDeleteManyArgs} args - Arguments to filter RegistrationTokens to delete.
     * @example
     * // Delete a few RegistrationTokens
     * const { count } = await prisma.registrationToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RegistrationTokenDeleteManyArgs>(args?: SelectSubset<T, RegistrationTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RegistrationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RegistrationTokens
     * const registrationToken = await prisma.registrationToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RegistrationTokenUpdateManyArgs>(args: SelectSubset<T, RegistrationTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RegistrationTokens and returns the data updated in the database.
     * @param {RegistrationTokenUpdateManyAndReturnArgs} args - Arguments to update many RegistrationTokens.
     * @example
     * // Update many RegistrationTokens
     * const registrationToken = await prisma.registrationToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RegistrationTokens and only return the `id`
     * const registrationTokenWithIdOnly = await prisma.registrationToken.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RegistrationTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, RegistrationTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RegistrationTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RegistrationToken.
     * @param {RegistrationTokenUpsertArgs} args - Arguments to update or create a RegistrationToken.
     * @example
     * // Update or create a RegistrationToken
     * const registrationToken = await prisma.registrationToken.upsert({
     *   create: {
     *     // ... data to create a RegistrationToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RegistrationToken we want to update
     *   }
     * })
     */
    upsert<T extends RegistrationTokenUpsertArgs>(args: SelectSubset<T, RegistrationTokenUpsertArgs<ExtArgs>>): Prisma__RegistrationTokenClient<$Result.GetResult<Prisma.$RegistrationTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RegistrationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationTokenCountArgs} args - Arguments to filter RegistrationTokens to count.
     * @example
     * // Count the number of RegistrationTokens
     * const count = await prisma.registrationToken.count({
     *   where: {
     *     // ... the filter for the RegistrationTokens we want to count
     *   }
     * })
    **/
    count<T extends RegistrationTokenCountArgs>(
      args?: Subset<T, RegistrationTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RegistrationTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RegistrationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RegistrationTokenAggregateArgs>(args: Subset<T, RegistrationTokenAggregateArgs>): Prisma.PrismaPromise<GetRegistrationTokenAggregateType<T>>

    /**
     * Group by RegistrationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RegistrationTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RegistrationTokenGroupByArgs['orderBy'] }
        : { orderBy?: RegistrationTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RegistrationTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRegistrationTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RegistrationToken model
   */
  readonly fields: RegistrationTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RegistrationToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RegistrationTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RegistrationToken model
   */
  interface RegistrationTokenFieldRefs {
    readonly id: FieldRef<"RegistrationToken", 'String'>
    readonly token: FieldRef<"RegistrationToken", 'String'>
    readonly originalToken: FieldRef<"RegistrationToken", 'String'>
    readonly isActive: FieldRef<"RegistrationToken", 'Boolean'>
    readonly createdAt: FieldRef<"RegistrationToken", 'DateTime'>
    readonly updatedAt: FieldRef<"RegistrationToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RegistrationToken findUnique
   */
  export type RegistrationTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationToken
     */
    select?: RegistrationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationToken
     */
    omit?: RegistrationTokenOmit<ExtArgs> | null
    /**
     * Filter, which RegistrationToken to fetch.
     */
    where: RegistrationTokenWhereUniqueInput
  }

  /**
   * RegistrationToken findUniqueOrThrow
   */
  export type RegistrationTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationToken
     */
    select?: RegistrationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationToken
     */
    omit?: RegistrationTokenOmit<ExtArgs> | null
    /**
     * Filter, which RegistrationToken to fetch.
     */
    where: RegistrationTokenWhereUniqueInput
  }

  /**
   * RegistrationToken findFirst
   */
  export type RegistrationTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationToken
     */
    select?: RegistrationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationToken
     */
    omit?: RegistrationTokenOmit<ExtArgs> | null
    /**
     * Filter, which RegistrationToken to fetch.
     */
    where?: RegistrationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RegistrationTokens to fetch.
     */
    orderBy?: RegistrationTokenOrderByWithRelationInput | RegistrationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RegistrationTokens.
     */
    cursor?: RegistrationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RegistrationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RegistrationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RegistrationTokens.
     */
    distinct?: RegistrationTokenScalarFieldEnum | RegistrationTokenScalarFieldEnum[]
  }

  /**
   * RegistrationToken findFirstOrThrow
   */
  export type RegistrationTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationToken
     */
    select?: RegistrationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationToken
     */
    omit?: RegistrationTokenOmit<ExtArgs> | null
    /**
     * Filter, which RegistrationToken to fetch.
     */
    where?: RegistrationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RegistrationTokens to fetch.
     */
    orderBy?: RegistrationTokenOrderByWithRelationInput | RegistrationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RegistrationTokens.
     */
    cursor?: RegistrationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RegistrationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RegistrationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RegistrationTokens.
     */
    distinct?: RegistrationTokenScalarFieldEnum | RegistrationTokenScalarFieldEnum[]
  }

  /**
   * RegistrationToken findMany
   */
  export type RegistrationTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationToken
     */
    select?: RegistrationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationToken
     */
    omit?: RegistrationTokenOmit<ExtArgs> | null
    /**
     * Filter, which RegistrationTokens to fetch.
     */
    where?: RegistrationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RegistrationTokens to fetch.
     */
    orderBy?: RegistrationTokenOrderByWithRelationInput | RegistrationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RegistrationTokens.
     */
    cursor?: RegistrationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RegistrationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RegistrationTokens.
     */
    skip?: number
    distinct?: RegistrationTokenScalarFieldEnum | RegistrationTokenScalarFieldEnum[]
  }

  /**
   * RegistrationToken create
   */
  export type RegistrationTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationToken
     */
    select?: RegistrationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationToken
     */
    omit?: RegistrationTokenOmit<ExtArgs> | null
    /**
     * The data needed to create a RegistrationToken.
     */
    data: XOR<RegistrationTokenCreateInput, RegistrationTokenUncheckedCreateInput>
  }

  /**
   * RegistrationToken createMany
   */
  export type RegistrationTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RegistrationTokens.
     */
    data: RegistrationTokenCreateManyInput | RegistrationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RegistrationToken createManyAndReturn
   */
  export type RegistrationTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationToken
     */
    select?: RegistrationTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationToken
     */
    omit?: RegistrationTokenOmit<ExtArgs> | null
    /**
     * The data used to create many RegistrationTokens.
     */
    data: RegistrationTokenCreateManyInput | RegistrationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RegistrationToken update
   */
  export type RegistrationTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationToken
     */
    select?: RegistrationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationToken
     */
    omit?: RegistrationTokenOmit<ExtArgs> | null
    /**
     * The data needed to update a RegistrationToken.
     */
    data: XOR<RegistrationTokenUpdateInput, RegistrationTokenUncheckedUpdateInput>
    /**
     * Choose, which RegistrationToken to update.
     */
    where: RegistrationTokenWhereUniqueInput
  }

  /**
   * RegistrationToken updateMany
   */
  export type RegistrationTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RegistrationTokens.
     */
    data: XOR<RegistrationTokenUpdateManyMutationInput, RegistrationTokenUncheckedUpdateManyInput>
    /**
     * Filter which RegistrationTokens to update
     */
    where?: RegistrationTokenWhereInput
    /**
     * Limit how many RegistrationTokens to update.
     */
    limit?: number
  }

  /**
   * RegistrationToken updateManyAndReturn
   */
  export type RegistrationTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationToken
     */
    select?: RegistrationTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationToken
     */
    omit?: RegistrationTokenOmit<ExtArgs> | null
    /**
     * The data used to update RegistrationTokens.
     */
    data: XOR<RegistrationTokenUpdateManyMutationInput, RegistrationTokenUncheckedUpdateManyInput>
    /**
     * Filter which RegistrationTokens to update
     */
    where?: RegistrationTokenWhereInput
    /**
     * Limit how many RegistrationTokens to update.
     */
    limit?: number
  }

  /**
   * RegistrationToken upsert
   */
  export type RegistrationTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationToken
     */
    select?: RegistrationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationToken
     */
    omit?: RegistrationTokenOmit<ExtArgs> | null
    /**
     * The filter to search for the RegistrationToken to update in case it exists.
     */
    where: RegistrationTokenWhereUniqueInput
    /**
     * In case the RegistrationToken found by the `where` argument doesn't exist, create a new RegistrationToken with this data.
     */
    create: XOR<RegistrationTokenCreateInput, RegistrationTokenUncheckedCreateInput>
    /**
     * In case the RegistrationToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RegistrationTokenUpdateInput, RegistrationTokenUncheckedUpdateInput>
  }

  /**
   * RegistrationToken delete
   */
  export type RegistrationTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationToken
     */
    select?: RegistrationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationToken
     */
    omit?: RegistrationTokenOmit<ExtArgs> | null
    /**
     * Filter which RegistrationToken to delete.
     */
    where: RegistrationTokenWhereUniqueInput
  }

  /**
   * RegistrationToken deleteMany
   */
  export type RegistrationTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RegistrationTokens to delete
     */
    where?: RegistrationTokenWhereInput
    /**
     * Limit how many RegistrationTokens to delete.
     */
    limit?: number
  }

  /**
   * RegistrationToken without action
   */
  export type RegistrationTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationToken
     */
    select?: RegistrationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationToken
     */
    omit?: RegistrationTokenOmit<ExtArgs> | null
  }


  /**
   * Model BookingDateRange
   */

  export type AggregateBookingDateRange = {
    _count: BookingDateRangeCountAggregateOutputType | null
    _min: BookingDateRangeMinAggregateOutputType | null
    _max: BookingDateRangeMaxAggregateOutputType | null
  }

  export type BookingDateRangeMinAggregateOutputType = {
    id: string | null
    name: string | null
    startDate: Date | null
    endDate: Date | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BookingDateRangeMaxAggregateOutputType = {
    id: string | null
    name: string | null
    startDate: Date | null
    endDate: Date | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BookingDateRangeCountAggregateOutputType = {
    id: number
    name: number
    startDate: number
    endDate: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BookingDateRangeMinAggregateInputType = {
    id?: true
    name?: true
    startDate?: true
    endDate?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BookingDateRangeMaxAggregateInputType = {
    id?: true
    name?: true
    startDate?: true
    endDate?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BookingDateRangeCountAggregateInputType = {
    id?: true
    name?: true
    startDate?: true
    endDate?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BookingDateRangeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BookingDateRange to aggregate.
     */
    where?: BookingDateRangeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingDateRanges to fetch.
     */
    orderBy?: BookingDateRangeOrderByWithRelationInput | BookingDateRangeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BookingDateRangeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingDateRanges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingDateRanges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BookingDateRanges
    **/
    _count?: true | BookingDateRangeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookingDateRangeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookingDateRangeMaxAggregateInputType
  }

  export type GetBookingDateRangeAggregateType<T extends BookingDateRangeAggregateArgs> = {
        [P in keyof T & keyof AggregateBookingDateRange]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBookingDateRange[P]>
      : GetScalarType<T[P], AggregateBookingDateRange[P]>
  }




  export type BookingDateRangeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingDateRangeWhereInput
    orderBy?: BookingDateRangeOrderByWithAggregationInput | BookingDateRangeOrderByWithAggregationInput[]
    by: BookingDateRangeScalarFieldEnum[] | BookingDateRangeScalarFieldEnum
    having?: BookingDateRangeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookingDateRangeCountAggregateInputType | true
    _min?: BookingDateRangeMinAggregateInputType
    _max?: BookingDateRangeMaxAggregateInputType
  }

  export type BookingDateRangeGroupByOutputType = {
    id: string
    name: string | null
    startDate: Date
    endDate: Date
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: BookingDateRangeCountAggregateOutputType | null
    _min: BookingDateRangeMinAggregateOutputType | null
    _max: BookingDateRangeMaxAggregateOutputType | null
  }

  type GetBookingDateRangeGroupByPayload<T extends BookingDateRangeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookingDateRangeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookingDateRangeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookingDateRangeGroupByOutputType[P]>
            : GetScalarType<T[P], BookingDateRangeGroupByOutputType[P]>
        }
      >
    >


  export type BookingDateRangeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    startDate?: boolean
    endDate?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["bookingDateRange"]>

  export type BookingDateRangeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    startDate?: boolean
    endDate?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["bookingDateRange"]>

  export type BookingDateRangeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    startDate?: boolean
    endDate?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["bookingDateRange"]>

  export type BookingDateRangeSelectScalar = {
    id?: boolean
    name?: boolean
    startDate?: boolean
    endDate?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BookingDateRangeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "startDate" | "endDate" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["bookingDateRange"]>

  export type $BookingDateRangePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BookingDateRange"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string | null
      startDate: Date
      endDate: Date
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["bookingDateRange"]>
    composites: {}
  }

  type BookingDateRangeGetPayload<S extends boolean | null | undefined | BookingDateRangeDefaultArgs> = $Result.GetResult<Prisma.$BookingDateRangePayload, S>

  type BookingDateRangeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BookingDateRangeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BookingDateRangeCountAggregateInputType | true
    }

  export interface BookingDateRangeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BookingDateRange'], meta: { name: 'BookingDateRange' } }
    /**
     * Find zero or one BookingDateRange that matches the filter.
     * @param {BookingDateRangeFindUniqueArgs} args - Arguments to find a BookingDateRange
     * @example
     * // Get one BookingDateRange
     * const bookingDateRange = await prisma.bookingDateRange.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BookingDateRangeFindUniqueArgs>(args: SelectSubset<T, BookingDateRangeFindUniqueArgs<ExtArgs>>): Prisma__BookingDateRangeClient<$Result.GetResult<Prisma.$BookingDateRangePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BookingDateRange that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BookingDateRangeFindUniqueOrThrowArgs} args - Arguments to find a BookingDateRange
     * @example
     * // Get one BookingDateRange
     * const bookingDateRange = await prisma.bookingDateRange.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BookingDateRangeFindUniqueOrThrowArgs>(args: SelectSubset<T, BookingDateRangeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BookingDateRangeClient<$Result.GetResult<Prisma.$BookingDateRangePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BookingDateRange that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingDateRangeFindFirstArgs} args - Arguments to find a BookingDateRange
     * @example
     * // Get one BookingDateRange
     * const bookingDateRange = await prisma.bookingDateRange.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BookingDateRangeFindFirstArgs>(args?: SelectSubset<T, BookingDateRangeFindFirstArgs<ExtArgs>>): Prisma__BookingDateRangeClient<$Result.GetResult<Prisma.$BookingDateRangePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BookingDateRange that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingDateRangeFindFirstOrThrowArgs} args - Arguments to find a BookingDateRange
     * @example
     * // Get one BookingDateRange
     * const bookingDateRange = await prisma.bookingDateRange.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BookingDateRangeFindFirstOrThrowArgs>(args?: SelectSubset<T, BookingDateRangeFindFirstOrThrowArgs<ExtArgs>>): Prisma__BookingDateRangeClient<$Result.GetResult<Prisma.$BookingDateRangePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BookingDateRanges that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingDateRangeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BookingDateRanges
     * const bookingDateRanges = await prisma.bookingDateRange.findMany()
     * 
     * // Get first 10 BookingDateRanges
     * const bookingDateRanges = await prisma.bookingDateRange.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookingDateRangeWithIdOnly = await prisma.bookingDateRange.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BookingDateRangeFindManyArgs>(args?: SelectSubset<T, BookingDateRangeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingDateRangePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BookingDateRange.
     * @param {BookingDateRangeCreateArgs} args - Arguments to create a BookingDateRange.
     * @example
     * // Create one BookingDateRange
     * const BookingDateRange = await prisma.bookingDateRange.create({
     *   data: {
     *     // ... data to create a BookingDateRange
     *   }
     * })
     * 
     */
    create<T extends BookingDateRangeCreateArgs>(args: SelectSubset<T, BookingDateRangeCreateArgs<ExtArgs>>): Prisma__BookingDateRangeClient<$Result.GetResult<Prisma.$BookingDateRangePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BookingDateRanges.
     * @param {BookingDateRangeCreateManyArgs} args - Arguments to create many BookingDateRanges.
     * @example
     * // Create many BookingDateRanges
     * const bookingDateRange = await prisma.bookingDateRange.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BookingDateRangeCreateManyArgs>(args?: SelectSubset<T, BookingDateRangeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BookingDateRanges and returns the data saved in the database.
     * @param {BookingDateRangeCreateManyAndReturnArgs} args - Arguments to create many BookingDateRanges.
     * @example
     * // Create many BookingDateRanges
     * const bookingDateRange = await prisma.bookingDateRange.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BookingDateRanges and only return the `id`
     * const bookingDateRangeWithIdOnly = await prisma.bookingDateRange.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BookingDateRangeCreateManyAndReturnArgs>(args?: SelectSubset<T, BookingDateRangeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingDateRangePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BookingDateRange.
     * @param {BookingDateRangeDeleteArgs} args - Arguments to delete one BookingDateRange.
     * @example
     * // Delete one BookingDateRange
     * const BookingDateRange = await prisma.bookingDateRange.delete({
     *   where: {
     *     // ... filter to delete one BookingDateRange
     *   }
     * })
     * 
     */
    delete<T extends BookingDateRangeDeleteArgs>(args: SelectSubset<T, BookingDateRangeDeleteArgs<ExtArgs>>): Prisma__BookingDateRangeClient<$Result.GetResult<Prisma.$BookingDateRangePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BookingDateRange.
     * @param {BookingDateRangeUpdateArgs} args - Arguments to update one BookingDateRange.
     * @example
     * // Update one BookingDateRange
     * const bookingDateRange = await prisma.bookingDateRange.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BookingDateRangeUpdateArgs>(args: SelectSubset<T, BookingDateRangeUpdateArgs<ExtArgs>>): Prisma__BookingDateRangeClient<$Result.GetResult<Prisma.$BookingDateRangePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BookingDateRanges.
     * @param {BookingDateRangeDeleteManyArgs} args - Arguments to filter BookingDateRanges to delete.
     * @example
     * // Delete a few BookingDateRanges
     * const { count } = await prisma.bookingDateRange.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BookingDateRangeDeleteManyArgs>(args?: SelectSubset<T, BookingDateRangeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BookingDateRanges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingDateRangeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BookingDateRanges
     * const bookingDateRange = await prisma.bookingDateRange.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BookingDateRangeUpdateManyArgs>(args: SelectSubset<T, BookingDateRangeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BookingDateRanges and returns the data updated in the database.
     * @param {BookingDateRangeUpdateManyAndReturnArgs} args - Arguments to update many BookingDateRanges.
     * @example
     * // Update many BookingDateRanges
     * const bookingDateRange = await prisma.bookingDateRange.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BookingDateRanges and only return the `id`
     * const bookingDateRangeWithIdOnly = await prisma.bookingDateRange.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BookingDateRangeUpdateManyAndReturnArgs>(args: SelectSubset<T, BookingDateRangeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingDateRangePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BookingDateRange.
     * @param {BookingDateRangeUpsertArgs} args - Arguments to update or create a BookingDateRange.
     * @example
     * // Update or create a BookingDateRange
     * const bookingDateRange = await prisma.bookingDateRange.upsert({
     *   create: {
     *     // ... data to create a BookingDateRange
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BookingDateRange we want to update
     *   }
     * })
     */
    upsert<T extends BookingDateRangeUpsertArgs>(args: SelectSubset<T, BookingDateRangeUpsertArgs<ExtArgs>>): Prisma__BookingDateRangeClient<$Result.GetResult<Prisma.$BookingDateRangePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BookingDateRanges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingDateRangeCountArgs} args - Arguments to filter BookingDateRanges to count.
     * @example
     * // Count the number of BookingDateRanges
     * const count = await prisma.bookingDateRange.count({
     *   where: {
     *     // ... the filter for the BookingDateRanges we want to count
     *   }
     * })
    **/
    count<T extends BookingDateRangeCountArgs>(
      args?: Subset<T, BookingDateRangeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookingDateRangeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BookingDateRange.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingDateRangeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BookingDateRangeAggregateArgs>(args: Subset<T, BookingDateRangeAggregateArgs>): Prisma.PrismaPromise<GetBookingDateRangeAggregateType<T>>

    /**
     * Group by BookingDateRange.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingDateRangeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BookingDateRangeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BookingDateRangeGroupByArgs['orderBy'] }
        : { orderBy?: BookingDateRangeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BookingDateRangeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookingDateRangeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BookingDateRange model
   */
  readonly fields: BookingDateRangeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BookingDateRange.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BookingDateRangeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BookingDateRange model
   */
  interface BookingDateRangeFieldRefs {
    readonly id: FieldRef<"BookingDateRange", 'String'>
    readonly name: FieldRef<"BookingDateRange", 'String'>
    readonly startDate: FieldRef<"BookingDateRange", 'DateTime'>
    readonly endDate: FieldRef<"BookingDateRange", 'DateTime'>
    readonly isActive: FieldRef<"BookingDateRange", 'Boolean'>
    readonly createdAt: FieldRef<"BookingDateRange", 'DateTime'>
    readonly updatedAt: FieldRef<"BookingDateRange", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BookingDateRange findUnique
   */
  export type BookingDateRangeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingDateRange
     */
    select?: BookingDateRangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingDateRange
     */
    omit?: BookingDateRangeOmit<ExtArgs> | null
    /**
     * Filter, which BookingDateRange to fetch.
     */
    where: BookingDateRangeWhereUniqueInput
  }

  /**
   * BookingDateRange findUniqueOrThrow
   */
  export type BookingDateRangeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingDateRange
     */
    select?: BookingDateRangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingDateRange
     */
    omit?: BookingDateRangeOmit<ExtArgs> | null
    /**
     * Filter, which BookingDateRange to fetch.
     */
    where: BookingDateRangeWhereUniqueInput
  }

  /**
   * BookingDateRange findFirst
   */
  export type BookingDateRangeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingDateRange
     */
    select?: BookingDateRangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingDateRange
     */
    omit?: BookingDateRangeOmit<ExtArgs> | null
    /**
     * Filter, which BookingDateRange to fetch.
     */
    where?: BookingDateRangeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingDateRanges to fetch.
     */
    orderBy?: BookingDateRangeOrderByWithRelationInput | BookingDateRangeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BookingDateRanges.
     */
    cursor?: BookingDateRangeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingDateRanges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingDateRanges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BookingDateRanges.
     */
    distinct?: BookingDateRangeScalarFieldEnum | BookingDateRangeScalarFieldEnum[]
  }

  /**
   * BookingDateRange findFirstOrThrow
   */
  export type BookingDateRangeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingDateRange
     */
    select?: BookingDateRangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingDateRange
     */
    omit?: BookingDateRangeOmit<ExtArgs> | null
    /**
     * Filter, which BookingDateRange to fetch.
     */
    where?: BookingDateRangeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingDateRanges to fetch.
     */
    orderBy?: BookingDateRangeOrderByWithRelationInput | BookingDateRangeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BookingDateRanges.
     */
    cursor?: BookingDateRangeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingDateRanges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingDateRanges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BookingDateRanges.
     */
    distinct?: BookingDateRangeScalarFieldEnum | BookingDateRangeScalarFieldEnum[]
  }

  /**
   * BookingDateRange findMany
   */
  export type BookingDateRangeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingDateRange
     */
    select?: BookingDateRangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingDateRange
     */
    omit?: BookingDateRangeOmit<ExtArgs> | null
    /**
     * Filter, which BookingDateRanges to fetch.
     */
    where?: BookingDateRangeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingDateRanges to fetch.
     */
    orderBy?: BookingDateRangeOrderByWithRelationInput | BookingDateRangeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BookingDateRanges.
     */
    cursor?: BookingDateRangeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingDateRanges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingDateRanges.
     */
    skip?: number
    distinct?: BookingDateRangeScalarFieldEnum | BookingDateRangeScalarFieldEnum[]
  }

  /**
   * BookingDateRange create
   */
  export type BookingDateRangeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingDateRange
     */
    select?: BookingDateRangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingDateRange
     */
    omit?: BookingDateRangeOmit<ExtArgs> | null
    /**
     * The data needed to create a BookingDateRange.
     */
    data: XOR<BookingDateRangeCreateInput, BookingDateRangeUncheckedCreateInput>
  }

  /**
   * BookingDateRange createMany
   */
  export type BookingDateRangeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BookingDateRanges.
     */
    data: BookingDateRangeCreateManyInput | BookingDateRangeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BookingDateRange createManyAndReturn
   */
  export type BookingDateRangeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingDateRange
     */
    select?: BookingDateRangeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BookingDateRange
     */
    omit?: BookingDateRangeOmit<ExtArgs> | null
    /**
     * The data used to create many BookingDateRanges.
     */
    data: BookingDateRangeCreateManyInput | BookingDateRangeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BookingDateRange update
   */
  export type BookingDateRangeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingDateRange
     */
    select?: BookingDateRangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingDateRange
     */
    omit?: BookingDateRangeOmit<ExtArgs> | null
    /**
     * The data needed to update a BookingDateRange.
     */
    data: XOR<BookingDateRangeUpdateInput, BookingDateRangeUncheckedUpdateInput>
    /**
     * Choose, which BookingDateRange to update.
     */
    where: BookingDateRangeWhereUniqueInput
  }

  /**
   * BookingDateRange updateMany
   */
  export type BookingDateRangeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BookingDateRanges.
     */
    data: XOR<BookingDateRangeUpdateManyMutationInput, BookingDateRangeUncheckedUpdateManyInput>
    /**
     * Filter which BookingDateRanges to update
     */
    where?: BookingDateRangeWhereInput
    /**
     * Limit how many BookingDateRanges to update.
     */
    limit?: number
  }

  /**
   * BookingDateRange updateManyAndReturn
   */
  export type BookingDateRangeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingDateRange
     */
    select?: BookingDateRangeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BookingDateRange
     */
    omit?: BookingDateRangeOmit<ExtArgs> | null
    /**
     * The data used to update BookingDateRanges.
     */
    data: XOR<BookingDateRangeUpdateManyMutationInput, BookingDateRangeUncheckedUpdateManyInput>
    /**
     * Filter which BookingDateRanges to update
     */
    where?: BookingDateRangeWhereInput
    /**
     * Limit how many BookingDateRanges to update.
     */
    limit?: number
  }

  /**
   * BookingDateRange upsert
   */
  export type BookingDateRangeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingDateRange
     */
    select?: BookingDateRangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingDateRange
     */
    omit?: BookingDateRangeOmit<ExtArgs> | null
    /**
     * The filter to search for the BookingDateRange to update in case it exists.
     */
    where: BookingDateRangeWhereUniqueInput
    /**
     * In case the BookingDateRange found by the `where` argument doesn't exist, create a new BookingDateRange with this data.
     */
    create: XOR<BookingDateRangeCreateInput, BookingDateRangeUncheckedCreateInput>
    /**
     * In case the BookingDateRange was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BookingDateRangeUpdateInput, BookingDateRangeUncheckedUpdateInput>
  }

  /**
   * BookingDateRange delete
   */
  export type BookingDateRangeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingDateRange
     */
    select?: BookingDateRangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingDateRange
     */
    omit?: BookingDateRangeOmit<ExtArgs> | null
    /**
     * Filter which BookingDateRange to delete.
     */
    where: BookingDateRangeWhereUniqueInput
  }

  /**
   * BookingDateRange deleteMany
   */
  export type BookingDateRangeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BookingDateRanges to delete
     */
    where?: BookingDateRangeWhereInput
    /**
     * Limit how many BookingDateRanges to delete.
     */
    limit?: number
  }

  /**
   * BookingDateRange without action
   */
  export type BookingDateRangeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingDateRange
     */
    select?: BookingDateRangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingDateRange
     */
    omit?: BookingDateRangeOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    password: 'password',
    phone: 'phone',
    role: 'role',
    isProfileComplete: 'isProfileComplete',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const HotelScalarFieldEnum: {
    id: 'id',
    name: 'name',
    address: 'address',
    description: 'description',
    floors: 'floors',
    hasEGFloor: 'hasEGFloor',
    image: 'image',
    displayOrder: 'displayOrder',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type HotelScalarFieldEnum = (typeof HotelScalarFieldEnum)[keyof typeof HotelScalarFieldEnum]


  export const RoomScalarFieldEnum: {
    id: 'id',
    number: 'number',
    hotelId: 'hotelId',
    name: 'name',
    type: 'type',
    capacity: 'capacity',
    maxCapacity: 'maxCapacity',
    beds: 'beds',
    floor: 'floor',
    price: 'price',
    position: 'position',
    width: 'width',
    height: 'height',
    isCommon: 'isCommon',
    zIndex: 'zIndex',
    description: 'description',
    hasShower: 'hasShower',
    hasToilet: 'hasToilet',
    pricePerPerson: 'pricePerPerson',
    textVertical: 'textVertical',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RoomScalarFieldEnum = (typeof RoomScalarFieldEnum)[keyof typeof RoomScalarFieldEnum]


  export const BookingScalarFieldEnum: {
    id: 'id',
    roomId: 'roomId',
    bookedBy: 'bookedBy',
    bookedDate: 'bookedDate',
    email: 'email',
    phone: 'phone',
    checkIn: 'checkIn',
    checkOut: 'checkOut',
    guests: 'guests',
    notes: 'notes',
    isConfirmed: 'isConfirmed',
    confirmedBy: 'confirmedBy',
    confirmedDate: 'confirmedDate',
    isPaid: 'isPaid',
    paymentMethod: 'paymentMethod',
    paymentDate: 'paymentDate',
    paidBy: 'paidBy',
    amount: 'amount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BookingScalarFieldEnum = (typeof BookingScalarFieldEnum)[keyof typeof BookingScalarFieldEnum]


  export const StairsScalarFieldEnum: {
    id: 'id',
    hotelId: 'hotelId',
    floor: 'floor',
    position: 'position',
    width: 'width',
    height: 'height',
    direction: 'direction',
    targetFloor: 'targetFloor',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type StairsScalarFieldEnum = (typeof StairsScalarFieldEnum)[keyof typeof StairsScalarFieldEnum]


  export const InviteScalarFieldEnum: {
    id: 'id',
    token: 'token',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    expiresAt: 'expiresAt',
    used: 'used',
    name: 'name',
    usedBy: 'usedBy',
    usedAt: 'usedAt'
  };

  export type InviteScalarFieldEnum = (typeof InviteScalarFieldEnum)[keyof typeof InviteScalarFieldEnum]


  export const FeedbackScalarFieldEnum: {
    id: 'id',
    userName: 'userName',
    userEmail: 'userEmail',
    userRole: 'userRole',
    comment: 'comment',
    screenshot: 'screenshot',
    userAgent: 'userAgent',
    isProcessed: 'isProcessed',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FeedbackScalarFieldEnum = (typeof FeedbackScalarFieldEnum)[keyof typeof FeedbackScalarFieldEnum]


  export const RegistrationTokenScalarFieldEnum: {
    id: 'id',
    token: 'token',
    originalToken: 'originalToken',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RegistrationTokenScalarFieldEnum = (typeof RegistrationTokenScalarFieldEnum)[keyof typeof RegistrationTokenScalarFieldEnum]


  export const BookingDateRangeScalarFieldEnum: {
    id: 'id',
    name: 'name',
    startDate: 'startDate',
    endDate: 'endDate',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BookingDateRangeScalarFieldEnum = (typeof BookingDateRangeScalarFieldEnum)[keyof typeof BookingDateRangeScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Bytes'
   */
  export type BytesFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Bytes'>
    


  /**
   * Reference to a field of type 'Bytes[]'
   */
  export type ListBytesFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Bytes[]'>
    


  /**
   * Reference to a field of type 'RoomType'
   */
  export type EnumRoomTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RoomType'>
    


  /**
   * Reference to a field of type 'RoomType[]'
   */
  export type ListEnumRoomTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RoomType[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'FloorType'
   */
  export type EnumFloorTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FloorType'>
    


  /**
   * Reference to a field of type 'FloorType[]'
   */
  export type ListEnumFloorTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FloorType[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'PaymentMethod'
   */
  export type EnumPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMethod'>
    


  /**
   * Reference to a field of type 'PaymentMethod[]'
   */
  export type ListEnumPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMethod[]'>
    


  /**
   * Reference to a field of type 'StairsDirection'
   */
  export type EnumStairsDirectionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StairsDirection'>
    


  /**
   * Reference to a field of type 'StairsDirection[]'
   */
  export type ListEnumStairsDirectionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StairsDirection[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringNullableFilter<"User"> | string | null
    name?: StringFilter<"User"> | string
    password?: StringNullableFilter<"User"> | string | null
    phone?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    isProfileComplete?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    createdInvites?: InviteListRelationFilter
    usedInvites?: InviteListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrderInput | SortOrder
    name?: SortOrder
    password?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    role?: SortOrder
    isProfileComplete?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdInvites?: InviteOrderByRelationAggregateInput
    usedInvites?: InviteOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    phone?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    password?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    isProfileComplete?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    createdInvites?: InviteListRelationFilter
    usedInvites?: InviteListRelationFilter
  }, "id" | "email" | "phone">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrderInput | SortOrder
    name?: SortOrder
    password?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    role?: SortOrder
    isProfileComplete?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    name?: StringWithAggregatesFilter<"User"> | string
    password?: StringNullableWithAggregatesFilter<"User"> | string | null
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    isProfileComplete?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type HotelWhereInput = {
    AND?: HotelWhereInput | HotelWhereInput[]
    OR?: HotelWhereInput[]
    NOT?: HotelWhereInput | HotelWhereInput[]
    id?: StringFilter<"Hotel"> | string
    name?: StringFilter<"Hotel"> | string
    address?: StringFilter<"Hotel"> | string
    description?: StringNullableFilter<"Hotel"> | string | null
    floors?: IntNullableFilter<"Hotel"> | number | null
    hasEGFloor?: BoolFilter<"Hotel"> | boolean
    image?: BytesNullableFilter<"Hotel"> | Bytes | null
    displayOrder?: IntNullableFilter<"Hotel"> | number | null
    createdAt?: DateTimeFilter<"Hotel"> | Date | string
    updatedAt?: DateTimeFilter<"Hotel"> | Date | string
    rooms?: RoomListRelationFilter
    stairs?: StairsListRelationFilter
  }

  export type HotelOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    description?: SortOrderInput | SortOrder
    floors?: SortOrderInput | SortOrder
    hasEGFloor?: SortOrder
    image?: SortOrderInput | SortOrder
    displayOrder?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    rooms?: RoomOrderByRelationAggregateInput
    stairs?: StairsOrderByRelationAggregateInput
  }

  export type HotelWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: HotelWhereInput | HotelWhereInput[]
    OR?: HotelWhereInput[]
    NOT?: HotelWhereInput | HotelWhereInput[]
    name?: StringFilter<"Hotel"> | string
    address?: StringFilter<"Hotel"> | string
    description?: StringNullableFilter<"Hotel"> | string | null
    floors?: IntNullableFilter<"Hotel"> | number | null
    hasEGFloor?: BoolFilter<"Hotel"> | boolean
    image?: BytesNullableFilter<"Hotel"> | Bytes | null
    displayOrder?: IntNullableFilter<"Hotel"> | number | null
    createdAt?: DateTimeFilter<"Hotel"> | Date | string
    updatedAt?: DateTimeFilter<"Hotel"> | Date | string
    rooms?: RoomListRelationFilter
    stairs?: StairsListRelationFilter
  }, "id">

  export type HotelOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    description?: SortOrderInput | SortOrder
    floors?: SortOrderInput | SortOrder
    hasEGFloor?: SortOrder
    image?: SortOrderInput | SortOrder
    displayOrder?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: HotelCountOrderByAggregateInput
    _avg?: HotelAvgOrderByAggregateInput
    _max?: HotelMaxOrderByAggregateInput
    _min?: HotelMinOrderByAggregateInput
    _sum?: HotelSumOrderByAggregateInput
  }

  export type HotelScalarWhereWithAggregatesInput = {
    AND?: HotelScalarWhereWithAggregatesInput | HotelScalarWhereWithAggregatesInput[]
    OR?: HotelScalarWhereWithAggregatesInput[]
    NOT?: HotelScalarWhereWithAggregatesInput | HotelScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Hotel"> | string
    name?: StringWithAggregatesFilter<"Hotel"> | string
    address?: StringWithAggregatesFilter<"Hotel"> | string
    description?: StringNullableWithAggregatesFilter<"Hotel"> | string | null
    floors?: IntNullableWithAggregatesFilter<"Hotel"> | number | null
    hasEGFloor?: BoolWithAggregatesFilter<"Hotel"> | boolean
    image?: BytesNullableWithAggregatesFilter<"Hotel"> | Bytes | null
    displayOrder?: IntNullableWithAggregatesFilter<"Hotel"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Hotel"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Hotel"> | Date | string
  }

  export type RoomWhereInput = {
    AND?: RoomWhereInput | RoomWhereInput[]
    OR?: RoomWhereInput[]
    NOT?: RoomWhereInput | RoomWhereInput[]
    id?: StringFilter<"Room"> | string
    number?: StringFilter<"Room"> | string
    hotelId?: StringFilter<"Room"> | string
    name?: StringNullableFilter<"Room"> | string | null
    type?: EnumRoomTypeFilter<"Room"> | $Enums.RoomType
    capacity?: StringFilter<"Room"> | string
    maxCapacity?: IntFilter<"Room"> | number
    beds?: JsonFilter<"Room">
    floor?: EnumFloorTypeFilter<"Room"> | $Enums.FloorType
    price?: DecimalFilter<"Room"> | Decimal | DecimalJsLike | number | string
    position?: JsonFilter<"Room">
    width?: IntNullableFilter<"Room"> | number | null
    height?: IntNullableFilter<"Room"> | number | null
    isCommon?: BoolFilter<"Room"> | boolean
    zIndex?: IntFilter<"Room"> | number
    description?: StringNullableFilter<"Room"> | string | null
    hasShower?: BoolFilter<"Room"> | boolean
    hasToilet?: BoolFilter<"Room"> | boolean
    pricePerPerson?: BoolFilter<"Room"> | boolean
    textVertical?: BoolFilter<"Room"> | boolean
    createdAt?: DateTimeFilter<"Room"> | Date | string
    updatedAt?: DateTimeFilter<"Room"> | Date | string
    hotel?: XOR<HotelScalarRelationFilter, HotelWhereInput>
    bookings?: BookingListRelationFilter
  }

  export type RoomOrderByWithRelationInput = {
    id?: SortOrder
    number?: SortOrder
    hotelId?: SortOrder
    name?: SortOrderInput | SortOrder
    type?: SortOrder
    capacity?: SortOrder
    maxCapacity?: SortOrder
    beds?: SortOrder
    floor?: SortOrder
    price?: SortOrder
    position?: SortOrder
    width?: SortOrderInput | SortOrder
    height?: SortOrderInput | SortOrder
    isCommon?: SortOrder
    zIndex?: SortOrder
    description?: SortOrderInput | SortOrder
    hasShower?: SortOrder
    hasToilet?: SortOrder
    pricePerPerson?: SortOrder
    textVertical?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    hotel?: HotelOrderByWithRelationInput
    bookings?: BookingOrderByRelationAggregateInput
  }

  export type RoomWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RoomWhereInput | RoomWhereInput[]
    OR?: RoomWhereInput[]
    NOT?: RoomWhereInput | RoomWhereInput[]
    number?: StringFilter<"Room"> | string
    hotelId?: StringFilter<"Room"> | string
    name?: StringNullableFilter<"Room"> | string | null
    type?: EnumRoomTypeFilter<"Room"> | $Enums.RoomType
    capacity?: StringFilter<"Room"> | string
    maxCapacity?: IntFilter<"Room"> | number
    beds?: JsonFilter<"Room">
    floor?: EnumFloorTypeFilter<"Room"> | $Enums.FloorType
    price?: DecimalFilter<"Room"> | Decimal | DecimalJsLike | number | string
    position?: JsonFilter<"Room">
    width?: IntNullableFilter<"Room"> | number | null
    height?: IntNullableFilter<"Room"> | number | null
    isCommon?: BoolFilter<"Room"> | boolean
    zIndex?: IntFilter<"Room"> | number
    description?: StringNullableFilter<"Room"> | string | null
    hasShower?: BoolFilter<"Room"> | boolean
    hasToilet?: BoolFilter<"Room"> | boolean
    pricePerPerson?: BoolFilter<"Room"> | boolean
    textVertical?: BoolFilter<"Room"> | boolean
    createdAt?: DateTimeFilter<"Room"> | Date | string
    updatedAt?: DateTimeFilter<"Room"> | Date | string
    hotel?: XOR<HotelScalarRelationFilter, HotelWhereInput>
    bookings?: BookingListRelationFilter
  }, "id">

  export type RoomOrderByWithAggregationInput = {
    id?: SortOrder
    number?: SortOrder
    hotelId?: SortOrder
    name?: SortOrderInput | SortOrder
    type?: SortOrder
    capacity?: SortOrder
    maxCapacity?: SortOrder
    beds?: SortOrder
    floor?: SortOrder
    price?: SortOrder
    position?: SortOrder
    width?: SortOrderInput | SortOrder
    height?: SortOrderInput | SortOrder
    isCommon?: SortOrder
    zIndex?: SortOrder
    description?: SortOrderInput | SortOrder
    hasShower?: SortOrder
    hasToilet?: SortOrder
    pricePerPerson?: SortOrder
    textVertical?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RoomCountOrderByAggregateInput
    _avg?: RoomAvgOrderByAggregateInput
    _max?: RoomMaxOrderByAggregateInput
    _min?: RoomMinOrderByAggregateInput
    _sum?: RoomSumOrderByAggregateInput
  }

  export type RoomScalarWhereWithAggregatesInput = {
    AND?: RoomScalarWhereWithAggregatesInput | RoomScalarWhereWithAggregatesInput[]
    OR?: RoomScalarWhereWithAggregatesInput[]
    NOT?: RoomScalarWhereWithAggregatesInput | RoomScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Room"> | string
    number?: StringWithAggregatesFilter<"Room"> | string
    hotelId?: StringWithAggregatesFilter<"Room"> | string
    name?: StringNullableWithAggregatesFilter<"Room"> | string | null
    type?: EnumRoomTypeWithAggregatesFilter<"Room"> | $Enums.RoomType
    capacity?: StringWithAggregatesFilter<"Room"> | string
    maxCapacity?: IntWithAggregatesFilter<"Room"> | number
    beds?: JsonWithAggregatesFilter<"Room">
    floor?: EnumFloorTypeWithAggregatesFilter<"Room"> | $Enums.FloorType
    price?: DecimalWithAggregatesFilter<"Room"> | Decimal | DecimalJsLike | number | string
    position?: JsonWithAggregatesFilter<"Room">
    width?: IntNullableWithAggregatesFilter<"Room"> | number | null
    height?: IntNullableWithAggregatesFilter<"Room"> | number | null
    isCommon?: BoolWithAggregatesFilter<"Room"> | boolean
    zIndex?: IntWithAggregatesFilter<"Room"> | number
    description?: StringNullableWithAggregatesFilter<"Room"> | string | null
    hasShower?: BoolWithAggregatesFilter<"Room"> | boolean
    hasToilet?: BoolWithAggregatesFilter<"Room"> | boolean
    pricePerPerson?: BoolWithAggregatesFilter<"Room"> | boolean
    textVertical?: BoolWithAggregatesFilter<"Room"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Room"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Room"> | Date | string
  }

  export type BookingWhereInput = {
    AND?: BookingWhereInput | BookingWhereInput[]
    OR?: BookingWhereInput[]
    NOT?: BookingWhereInput | BookingWhereInput[]
    id?: StringFilter<"Booking"> | string
    roomId?: StringFilter<"Booking"> | string
    bookedBy?: StringFilter<"Booking"> | string
    bookedDate?: DateTimeFilter<"Booking"> | Date | string
    email?: StringNullableFilter<"Booking"> | string | null
    phone?: StringFilter<"Booking"> | string
    checkIn?: DateTimeFilter<"Booking"> | Date | string
    checkOut?: DateTimeFilter<"Booking"> | Date | string
    guests?: JsonFilter<"Booking">
    notes?: StringNullableFilter<"Booking"> | string | null
    isConfirmed?: BoolFilter<"Booking"> | boolean
    confirmedBy?: StringNullableFilter<"Booking"> | string | null
    confirmedDate?: DateTimeNullableFilter<"Booking"> | Date | string | null
    isPaid?: BoolFilter<"Booking"> | boolean
    paymentMethod?: EnumPaymentMethodNullableFilter<"Booking"> | $Enums.PaymentMethod | null
    paymentDate?: DateTimeNullableFilter<"Booking"> | Date | string | null
    paidBy?: StringNullableFilter<"Booking"> | string | null
    amount?: DecimalNullableFilter<"Booking"> | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFilter<"Booking"> | Date | string
    updatedAt?: DateTimeFilter<"Booking"> | Date | string
    room?: XOR<RoomScalarRelationFilter, RoomWhereInput>
  }

  export type BookingOrderByWithRelationInput = {
    id?: SortOrder
    roomId?: SortOrder
    bookedBy?: SortOrder
    bookedDate?: SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrder
    checkIn?: SortOrder
    checkOut?: SortOrder
    guests?: SortOrder
    notes?: SortOrderInput | SortOrder
    isConfirmed?: SortOrder
    confirmedBy?: SortOrderInput | SortOrder
    confirmedDate?: SortOrderInput | SortOrder
    isPaid?: SortOrder
    paymentMethod?: SortOrderInput | SortOrder
    paymentDate?: SortOrderInput | SortOrder
    paidBy?: SortOrderInput | SortOrder
    amount?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    room?: RoomOrderByWithRelationInput
  }

  export type BookingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BookingWhereInput | BookingWhereInput[]
    OR?: BookingWhereInput[]
    NOT?: BookingWhereInput | BookingWhereInput[]
    roomId?: StringFilter<"Booking"> | string
    bookedBy?: StringFilter<"Booking"> | string
    bookedDate?: DateTimeFilter<"Booking"> | Date | string
    email?: StringNullableFilter<"Booking"> | string | null
    phone?: StringFilter<"Booking"> | string
    checkIn?: DateTimeFilter<"Booking"> | Date | string
    checkOut?: DateTimeFilter<"Booking"> | Date | string
    guests?: JsonFilter<"Booking">
    notes?: StringNullableFilter<"Booking"> | string | null
    isConfirmed?: BoolFilter<"Booking"> | boolean
    confirmedBy?: StringNullableFilter<"Booking"> | string | null
    confirmedDate?: DateTimeNullableFilter<"Booking"> | Date | string | null
    isPaid?: BoolFilter<"Booking"> | boolean
    paymentMethod?: EnumPaymentMethodNullableFilter<"Booking"> | $Enums.PaymentMethod | null
    paymentDate?: DateTimeNullableFilter<"Booking"> | Date | string | null
    paidBy?: StringNullableFilter<"Booking"> | string | null
    amount?: DecimalNullableFilter<"Booking"> | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFilter<"Booking"> | Date | string
    updatedAt?: DateTimeFilter<"Booking"> | Date | string
    room?: XOR<RoomScalarRelationFilter, RoomWhereInput>
  }, "id">

  export type BookingOrderByWithAggregationInput = {
    id?: SortOrder
    roomId?: SortOrder
    bookedBy?: SortOrder
    bookedDate?: SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrder
    checkIn?: SortOrder
    checkOut?: SortOrder
    guests?: SortOrder
    notes?: SortOrderInput | SortOrder
    isConfirmed?: SortOrder
    confirmedBy?: SortOrderInput | SortOrder
    confirmedDate?: SortOrderInput | SortOrder
    isPaid?: SortOrder
    paymentMethod?: SortOrderInput | SortOrder
    paymentDate?: SortOrderInput | SortOrder
    paidBy?: SortOrderInput | SortOrder
    amount?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BookingCountOrderByAggregateInput
    _avg?: BookingAvgOrderByAggregateInput
    _max?: BookingMaxOrderByAggregateInput
    _min?: BookingMinOrderByAggregateInput
    _sum?: BookingSumOrderByAggregateInput
  }

  export type BookingScalarWhereWithAggregatesInput = {
    AND?: BookingScalarWhereWithAggregatesInput | BookingScalarWhereWithAggregatesInput[]
    OR?: BookingScalarWhereWithAggregatesInput[]
    NOT?: BookingScalarWhereWithAggregatesInput | BookingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Booking"> | string
    roomId?: StringWithAggregatesFilter<"Booking"> | string
    bookedBy?: StringWithAggregatesFilter<"Booking"> | string
    bookedDate?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
    email?: StringNullableWithAggregatesFilter<"Booking"> | string | null
    phone?: StringWithAggregatesFilter<"Booking"> | string
    checkIn?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
    checkOut?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
    guests?: JsonWithAggregatesFilter<"Booking">
    notes?: StringNullableWithAggregatesFilter<"Booking"> | string | null
    isConfirmed?: BoolWithAggregatesFilter<"Booking"> | boolean
    confirmedBy?: StringNullableWithAggregatesFilter<"Booking"> | string | null
    confirmedDate?: DateTimeNullableWithAggregatesFilter<"Booking"> | Date | string | null
    isPaid?: BoolWithAggregatesFilter<"Booking"> | boolean
    paymentMethod?: EnumPaymentMethodNullableWithAggregatesFilter<"Booking"> | $Enums.PaymentMethod | null
    paymentDate?: DateTimeNullableWithAggregatesFilter<"Booking"> | Date | string | null
    paidBy?: StringNullableWithAggregatesFilter<"Booking"> | string | null
    amount?: DecimalNullableWithAggregatesFilter<"Booking"> | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
  }

  export type StairsWhereInput = {
    AND?: StairsWhereInput | StairsWhereInput[]
    OR?: StairsWhereInput[]
    NOT?: StairsWhereInput | StairsWhereInput[]
    id?: StringFilter<"Stairs"> | string
    hotelId?: StringFilter<"Stairs"> | string
    floor?: EnumFloorTypeFilter<"Stairs"> | $Enums.FloorType
    position?: JsonFilter<"Stairs">
    width?: IntFilter<"Stairs"> | number
    height?: IntFilter<"Stairs"> | number
    direction?: EnumStairsDirectionFilter<"Stairs"> | $Enums.StairsDirection
    targetFloor?: EnumFloorTypeNullableFilter<"Stairs"> | $Enums.FloorType | null
    createdAt?: DateTimeFilter<"Stairs"> | Date | string
    updatedAt?: DateTimeFilter<"Stairs"> | Date | string
    hotel?: XOR<HotelScalarRelationFilter, HotelWhereInput>
  }

  export type StairsOrderByWithRelationInput = {
    id?: SortOrder
    hotelId?: SortOrder
    floor?: SortOrder
    position?: SortOrder
    width?: SortOrder
    height?: SortOrder
    direction?: SortOrder
    targetFloor?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    hotel?: HotelOrderByWithRelationInput
  }

  export type StairsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StairsWhereInput | StairsWhereInput[]
    OR?: StairsWhereInput[]
    NOT?: StairsWhereInput | StairsWhereInput[]
    hotelId?: StringFilter<"Stairs"> | string
    floor?: EnumFloorTypeFilter<"Stairs"> | $Enums.FloorType
    position?: JsonFilter<"Stairs">
    width?: IntFilter<"Stairs"> | number
    height?: IntFilter<"Stairs"> | number
    direction?: EnumStairsDirectionFilter<"Stairs"> | $Enums.StairsDirection
    targetFloor?: EnumFloorTypeNullableFilter<"Stairs"> | $Enums.FloorType | null
    createdAt?: DateTimeFilter<"Stairs"> | Date | string
    updatedAt?: DateTimeFilter<"Stairs"> | Date | string
    hotel?: XOR<HotelScalarRelationFilter, HotelWhereInput>
  }, "id">

  export type StairsOrderByWithAggregationInput = {
    id?: SortOrder
    hotelId?: SortOrder
    floor?: SortOrder
    position?: SortOrder
    width?: SortOrder
    height?: SortOrder
    direction?: SortOrder
    targetFloor?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: StairsCountOrderByAggregateInput
    _avg?: StairsAvgOrderByAggregateInput
    _max?: StairsMaxOrderByAggregateInput
    _min?: StairsMinOrderByAggregateInput
    _sum?: StairsSumOrderByAggregateInput
  }

  export type StairsScalarWhereWithAggregatesInput = {
    AND?: StairsScalarWhereWithAggregatesInput | StairsScalarWhereWithAggregatesInput[]
    OR?: StairsScalarWhereWithAggregatesInput[]
    NOT?: StairsScalarWhereWithAggregatesInput | StairsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Stairs"> | string
    hotelId?: StringWithAggregatesFilter<"Stairs"> | string
    floor?: EnumFloorTypeWithAggregatesFilter<"Stairs"> | $Enums.FloorType
    position?: JsonWithAggregatesFilter<"Stairs">
    width?: IntWithAggregatesFilter<"Stairs"> | number
    height?: IntWithAggregatesFilter<"Stairs"> | number
    direction?: EnumStairsDirectionWithAggregatesFilter<"Stairs"> | $Enums.StairsDirection
    targetFloor?: EnumFloorTypeNullableWithAggregatesFilter<"Stairs"> | $Enums.FloorType | null
    createdAt?: DateTimeWithAggregatesFilter<"Stairs"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Stairs"> | Date | string
  }

  export type InviteWhereInput = {
    AND?: InviteWhereInput | InviteWhereInput[]
    OR?: InviteWhereInput[]
    NOT?: InviteWhereInput | InviteWhereInput[]
    id?: StringFilter<"Invite"> | string
    token?: StringFilter<"Invite"> | string
    createdBy?: StringFilter<"Invite"> | string
    createdAt?: DateTimeFilter<"Invite"> | Date | string
    expiresAt?: DateTimeFilter<"Invite"> | Date | string
    used?: BoolFilter<"Invite"> | boolean
    name?: StringFilter<"Invite"> | string
    usedBy?: StringNullableFilter<"Invite"> | string | null
    usedAt?: DateTimeNullableFilter<"Invite"> | Date | string | null
    creator?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type InviteOrderByWithRelationInput = {
    id?: SortOrder
    token?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    used?: SortOrder
    name?: SortOrder
    usedBy?: SortOrderInput | SortOrder
    usedAt?: SortOrderInput | SortOrder
    creator?: UserOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type InviteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: InviteWhereInput | InviteWhereInput[]
    OR?: InviteWhereInput[]
    NOT?: InviteWhereInput | InviteWhereInput[]
    createdBy?: StringFilter<"Invite"> | string
    createdAt?: DateTimeFilter<"Invite"> | Date | string
    expiresAt?: DateTimeFilter<"Invite"> | Date | string
    used?: BoolFilter<"Invite"> | boolean
    name?: StringFilter<"Invite"> | string
    usedBy?: StringNullableFilter<"Invite"> | string | null
    usedAt?: DateTimeNullableFilter<"Invite"> | Date | string | null
    creator?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id" | "token">

  export type InviteOrderByWithAggregationInput = {
    id?: SortOrder
    token?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    used?: SortOrder
    name?: SortOrder
    usedBy?: SortOrderInput | SortOrder
    usedAt?: SortOrderInput | SortOrder
    _count?: InviteCountOrderByAggregateInput
    _max?: InviteMaxOrderByAggregateInput
    _min?: InviteMinOrderByAggregateInput
  }

  export type InviteScalarWhereWithAggregatesInput = {
    AND?: InviteScalarWhereWithAggregatesInput | InviteScalarWhereWithAggregatesInput[]
    OR?: InviteScalarWhereWithAggregatesInput[]
    NOT?: InviteScalarWhereWithAggregatesInput | InviteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Invite"> | string
    token?: StringWithAggregatesFilter<"Invite"> | string
    createdBy?: StringWithAggregatesFilter<"Invite"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Invite"> | Date | string
    expiresAt?: DateTimeWithAggregatesFilter<"Invite"> | Date | string
    used?: BoolWithAggregatesFilter<"Invite"> | boolean
    name?: StringWithAggregatesFilter<"Invite"> | string
    usedBy?: StringNullableWithAggregatesFilter<"Invite"> | string | null
    usedAt?: DateTimeNullableWithAggregatesFilter<"Invite"> | Date | string | null
  }

  export type FeedbackWhereInput = {
    AND?: FeedbackWhereInput | FeedbackWhereInput[]
    OR?: FeedbackWhereInput[]
    NOT?: FeedbackWhereInput | FeedbackWhereInput[]
    id?: StringFilter<"Feedback"> | string
    userName?: StringFilter<"Feedback"> | string
    userEmail?: StringNullableFilter<"Feedback"> | string | null
    userRole?: StringFilter<"Feedback"> | string
    comment?: StringFilter<"Feedback"> | string
    screenshot?: StringNullableFilter<"Feedback"> | string | null
    userAgent?: StringNullableFilter<"Feedback"> | string | null
    isProcessed?: BoolFilter<"Feedback"> | boolean
    createdAt?: DateTimeFilter<"Feedback"> | Date | string
    updatedAt?: DateTimeFilter<"Feedback"> | Date | string
  }

  export type FeedbackOrderByWithRelationInput = {
    id?: SortOrder
    userName?: SortOrder
    userEmail?: SortOrderInput | SortOrder
    userRole?: SortOrder
    comment?: SortOrder
    screenshot?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    isProcessed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FeedbackWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FeedbackWhereInput | FeedbackWhereInput[]
    OR?: FeedbackWhereInput[]
    NOT?: FeedbackWhereInput | FeedbackWhereInput[]
    userName?: StringFilter<"Feedback"> | string
    userEmail?: StringNullableFilter<"Feedback"> | string | null
    userRole?: StringFilter<"Feedback"> | string
    comment?: StringFilter<"Feedback"> | string
    screenshot?: StringNullableFilter<"Feedback"> | string | null
    userAgent?: StringNullableFilter<"Feedback"> | string | null
    isProcessed?: BoolFilter<"Feedback"> | boolean
    createdAt?: DateTimeFilter<"Feedback"> | Date | string
    updatedAt?: DateTimeFilter<"Feedback"> | Date | string
  }, "id">

  export type FeedbackOrderByWithAggregationInput = {
    id?: SortOrder
    userName?: SortOrder
    userEmail?: SortOrderInput | SortOrder
    userRole?: SortOrder
    comment?: SortOrder
    screenshot?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    isProcessed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FeedbackCountOrderByAggregateInput
    _max?: FeedbackMaxOrderByAggregateInput
    _min?: FeedbackMinOrderByAggregateInput
  }

  export type FeedbackScalarWhereWithAggregatesInput = {
    AND?: FeedbackScalarWhereWithAggregatesInput | FeedbackScalarWhereWithAggregatesInput[]
    OR?: FeedbackScalarWhereWithAggregatesInput[]
    NOT?: FeedbackScalarWhereWithAggregatesInput | FeedbackScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Feedback"> | string
    userName?: StringWithAggregatesFilter<"Feedback"> | string
    userEmail?: StringNullableWithAggregatesFilter<"Feedback"> | string | null
    userRole?: StringWithAggregatesFilter<"Feedback"> | string
    comment?: StringWithAggregatesFilter<"Feedback"> | string
    screenshot?: StringNullableWithAggregatesFilter<"Feedback"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"Feedback"> | string | null
    isProcessed?: BoolWithAggregatesFilter<"Feedback"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Feedback"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Feedback"> | Date | string
  }

  export type RegistrationTokenWhereInput = {
    AND?: RegistrationTokenWhereInput | RegistrationTokenWhereInput[]
    OR?: RegistrationTokenWhereInput[]
    NOT?: RegistrationTokenWhereInput | RegistrationTokenWhereInput[]
    id?: StringFilter<"RegistrationToken"> | string
    token?: StringFilter<"RegistrationToken"> | string
    originalToken?: StringNullableFilter<"RegistrationToken"> | string | null
    isActive?: BoolFilter<"RegistrationToken"> | boolean
    createdAt?: DateTimeFilter<"RegistrationToken"> | Date | string
    updatedAt?: DateTimeFilter<"RegistrationToken"> | Date | string
  }

  export type RegistrationTokenOrderByWithRelationInput = {
    id?: SortOrder
    token?: SortOrder
    originalToken?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RegistrationTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: RegistrationTokenWhereInput | RegistrationTokenWhereInput[]
    OR?: RegistrationTokenWhereInput[]
    NOT?: RegistrationTokenWhereInput | RegistrationTokenWhereInput[]
    originalToken?: StringNullableFilter<"RegistrationToken"> | string | null
    isActive?: BoolFilter<"RegistrationToken"> | boolean
    createdAt?: DateTimeFilter<"RegistrationToken"> | Date | string
    updatedAt?: DateTimeFilter<"RegistrationToken"> | Date | string
  }, "id" | "token">

  export type RegistrationTokenOrderByWithAggregationInput = {
    id?: SortOrder
    token?: SortOrder
    originalToken?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RegistrationTokenCountOrderByAggregateInput
    _max?: RegistrationTokenMaxOrderByAggregateInput
    _min?: RegistrationTokenMinOrderByAggregateInput
  }

  export type RegistrationTokenScalarWhereWithAggregatesInput = {
    AND?: RegistrationTokenScalarWhereWithAggregatesInput | RegistrationTokenScalarWhereWithAggregatesInput[]
    OR?: RegistrationTokenScalarWhereWithAggregatesInput[]
    NOT?: RegistrationTokenScalarWhereWithAggregatesInput | RegistrationTokenScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RegistrationToken"> | string
    token?: StringWithAggregatesFilter<"RegistrationToken"> | string
    originalToken?: StringNullableWithAggregatesFilter<"RegistrationToken"> | string | null
    isActive?: BoolWithAggregatesFilter<"RegistrationToken"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"RegistrationToken"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"RegistrationToken"> | Date | string
  }

  export type BookingDateRangeWhereInput = {
    AND?: BookingDateRangeWhereInput | BookingDateRangeWhereInput[]
    OR?: BookingDateRangeWhereInput[]
    NOT?: BookingDateRangeWhereInput | BookingDateRangeWhereInput[]
    id?: StringFilter<"BookingDateRange"> | string
    name?: StringNullableFilter<"BookingDateRange"> | string | null
    startDate?: DateTimeFilter<"BookingDateRange"> | Date | string
    endDate?: DateTimeFilter<"BookingDateRange"> | Date | string
    isActive?: BoolFilter<"BookingDateRange"> | boolean
    createdAt?: DateTimeFilter<"BookingDateRange"> | Date | string
    updatedAt?: DateTimeFilter<"BookingDateRange"> | Date | string
  }

  export type BookingDateRangeOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BookingDateRangeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BookingDateRangeWhereInput | BookingDateRangeWhereInput[]
    OR?: BookingDateRangeWhereInput[]
    NOT?: BookingDateRangeWhereInput | BookingDateRangeWhereInput[]
    name?: StringNullableFilter<"BookingDateRange"> | string | null
    startDate?: DateTimeFilter<"BookingDateRange"> | Date | string
    endDate?: DateTimeFilter<"BookingDateRange"> | Date | string
    isActive?: BoolFilter<"BookingDateRange"> | boolean
    createdAt?: DateTimeFilter<"BookingDateRange"> | Date | string
    updatedAt?: DateTimeFilter<"BookingDateRange"> | Date | string
  }, "id">

  export type BookingDateRangeOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BookingDateRangeCountOrderByAggregateInput
    _max?: BookingDateRangeMaxOrderByAggregateInput
    _min?: BookingDateRangeMinOrderByAggregateInput
  }

  export type BookingDateRangeScalarWhereWithAggregatesInput = {
    AND?: BookingDateRangeScalarWhereWithAggregatesInput | BookingDateRangeScalarWhereWithAggregatesInput[]
    OR?: BookingDateRangeScalarWhereWithAggregatesInput[]
    NOT?: BookingDateRangeScalarWhereWithAggregatesInput | BookingDateRangeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BookingDateRange"> | string
    name?: StringNullableWithAggregatesFilter<"BookingDateRange"> | string | null
    startDate?: DateTimeWithAggregatesFilter<"BookingDateRange"> | Date | string
    endDate?: DateTimeWithAggregatesFilter<"BookingDateRange"> | Date | string
    isActive?: BoolWithAggregatesFilter<"BookingDateRange"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"BookingDateRange"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"BookingDateRange"> | Date | string
  }

  export type UserCreateInput = {
    id: string
    email?: string | null
    name: string
    password?: string | null
    phone?: string | null
    role: $Enums.UserRole
    isProfileComplete?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    createdInvites?: InviteCreateNestedManyWithoutCreatorInput
    usedInvites?: InviteCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id: string
    email?: string | null
    name: string
    password?: string | null
    phone?: string | null
    role: $Enums.UserRole
    isProfileComplete?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    createdInvites?: InviteUncheckedCreateNestedManyWithoutCreatorInput
    usedInvites?: InviteUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isProfileComplete?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdInvites?: InviteUpdateManyWithoutCreatorNestedInput
    usedInvites?: InviteUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isProfileComplete?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdInvites?: InviteUncheckedUpdateManyWithoutCreatorNestedInput
    usedInvites?: InviteUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id: string
    email?: string | null
    name: string
    password?: string | null
    phone?: string | null
    role: $Enums.UserRole
    isProfileComplete?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isProfileComplete?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isProfileComplete?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HotelCreateInput = {
    id: string
    name: string
    address: string
    description?: string | null
    floors?: number | null
    hasEGFloor?: boolean
    image?: Bytes | null
    displayOrder?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    rooms?: RoomCreateNestedManyWithoutHotelInput
    stairs?: StairsCreateNestedManyWithoutHotelInput
  }

  export type HotelUncheckedCreateInput = {
    id: string
    name: string
    address: string
    description?: string | null
    floors?: number | null
    hasEGFloor?: boolean
    image?: Bytes | null
    displayOrder?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    rooms?: RoomUncheckedCreateNestedManyWithoutHotelInput
    stairs?: StairsUncheckedCreateNestedManyWithoutHotelInput
  }

  export type HotelUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    floors?: NullableIntFieldUpdateOperationsInput | number | null
    hasEGFloor?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableBytesFieldUpdateOperationsInput | Bytes | null
    displayOrder?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rooms?: RoomUpdateManyWithoutHotelNestedInput
    stairs?: StairsUpdateManyWithoutHotelNestedInput
  }

  export type HotelUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    floors?: NullableIntFieldUpdateOperationsInput | number | null
    hasEGFloor?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableBytesFieldUpdateOperationsInput | Bytes | null
    displayOrder?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rooms?: RoomUncheckedUpdateManyWithoutHotelNestedInput
    stairs?: StairsUncheckedUpdateManyWithoutHotelNestedInput
  }

  export type HotelCreateManyInput = {
    id: string
    name: string
    address: string
    description?: string | null
    floors?: number | null
    hasEGFloor?: boolean
    image?: Bytes | null
    displayOrder?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type HotelUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    floors?: NullableIntFieldUpdateOperationsInput | number | null
    hasEGFloor?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableBytesFieldUpdateOperationsInput | Bytes | null
    displayOrder?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HotelUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    floors?: NullableIntFieldUpdateOperationsInput | number | null
    hasEGFloor?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableBytesFieldUpdateOperationsInput | Bytes | null
    displayOrder?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoomCreateInput = {
    id: string
    number: string
    name?: string | null
    type: $Enums.RoomType
    capacity: string
    maxCapacity: number
    beds?: JsonNullValueInput | InputJsonValue
    floor: $Enums.FloorType
    price?: Decimal | DecimalJsLike | number | string
    position?: JsonNullValueInput | InputJsonValue
    width?: number | null
    height?: number | null
    isCommon?: boolean
    zIndex?: number
    description?: string | null
    hasShower?: boolean
    hasToilet?: boolean
    pricePerPerson?: boolean
    textVertical?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    hotel: HotelCreateNestedOneWithoutRoomsInput
    bookings?: BookingCreateNestedManyWithoutRoomInput
  }

  export type RoomUncheckedCreateInput = {
    id: string
    number: string
    hotelId: string
    name?: string | null
    type: $Enums.RoomType
    capacity: string
    maxCapacity: number
    beds?: JsonNullValueInput | InputJsonValue
    floor: $Enums.FloorType
    price?: Decimal | DecimalJsLike | number | string
    position?: JsonNullValueInput | InputJsonValue
    width?: number | null
    height?: number | null
    isCommon?: boolean
    zIndex?: number
    description?: string | null
    hasShower?: boolean
    hasToilet?: boolean
    pricePerPerson?: boolean
    textVertical?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    bookings?: BookingUncheckedCreateNestedManyWithoutRoomInput
  }

  export type RoomUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    number?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumRoomTypeFieldUpdateOperationsInput | $Enums.RoomType
    capacity?: StringFieldUpdateOperationsInput | string
    maxCapacity?: IntFieldUpdateOperationsInput | number
    beds?: JsonNullValueInput | InputJsonValue
    floor?: EnumFloorTypeFieldUpdateOperationsInput | $Enums.FloorType
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    position?: JsonNullValueInput | InputJsonValue
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    isCommon?: BoolFieldUpdateOperationsInput | boolean
    zIndex?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    hasShower?: BoolFieldUpdateOperationsInput | boolean
    hasToilet?: BoolFieldUpdateOperationsInput | boolean
    pricePerPerson?: BoolFieldUpdateOperationsInput | boolean
    textVertical?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hotel?: HotelUpdateOneRequiredWithoutRoomsNestedInput
    bookings?: BookingUpdateManyWithoutRoomNestedInput
  }

  export type RoomUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    number?: StringFieldUpdateOperationsInput | string
    hotelId?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumRoomTypeFieldUpdateOperationsInput | $Enums.RoomType
    capacity?: StringFieldUpdateOperationsInput | string
    maxCapacity?: IntFieldUpdateOperationsInput | number
    beds?: JsonNullValueInput | InputJsonValue
    floor?: EnumFloorTypeFieldUpdateOperationsInput | $Enums.FloorType
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    position?: JsonNullValueInput | InputJsonValue
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    isCommon?: BoolFieldUpdateOperationsInput | boolean
    zIndex?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    hasShower?: BoolFieldUpdateOperationsInput | boolean
    hasToilet?: BoolFieldUpdateOperationsInput | boolean
    pricePerPerson?: BoolFieldUpdateOperationsInput | boolean
    textVertical?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookings?: BookingUncheckedUpdateManyWithoutRoomNestedInput
  }

  export type RoomCreateManyInput = {
    id: string
    number: string
    hotelId: string
    name?: string | null
    type: $Enums.RoomType
    capacity: string
    maxCapacity: number
    beds?: JsonNullValueInput | InputJsonValue
    floor: $Enums.FloorType
    price?: Decimal | DecimalJsLike | number | string
    position?: JsonNullValueInput | InputJsonValue
    width?: number | null
    height?: number | null
    isCommon?: boolean
    zIndex?: number
    description?: string | null
    hasShower?: boolean
    hasToilet?: boolean
    pricePerPerson?: boolean
    textVertical?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoomUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    number?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumRoomTypeFieldUpdateOperationsInput | $Enums.RoomType
    capacity?: StringFieldUpdateOperationsInput | string
    maxCapacity?: IntFieldUpdateOperationsInput | number
    beds?: JsonNullValueInput | InputJsonValue
    floor?: EnumFloorTypeFieldUpdateOperationsInput | $Enums.FloorType
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    position?: JsonNullValueInput | InputJsonValue
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    isCommon?: BoolFieldUpdateOperationsInput | boolean
    zIndex?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    hasShower?: BoolFieldUpdateOperationsInput | boolean
    hasToilet?: BoolFieldUpdateOperationsInput | boolean
    pricePerPerson?: BoolFieldUpdateOperationsInput | boolean
    textVertical?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoomUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    number?: StringFieldUpdateOperationsInput | string
    hotelId?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumRoomTypeFieldUpdateOperationsInput | $Enums.RoomType
    capacity?: StringFieldUpdateOperationsInput | string
    maxCapacity?: IntFieldUpdateOperationsInput | number
    beds?: JsonNullValueInput | InputJsonValue
    floor?: EnumFloorTypeFieldUpdateOperationsInput | $Enums.FloorType
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    position?: JsonNullValueInput | InputJsonValue
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    isCommon?: BoolFieldUpdateOperationsInput | boolean
    zIndex?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    hasShower?: BoolFieldUpdateOperationsInput | boolean
    hasToilet?: BoolFieldUpdateOperationsInput | boolean
    pricePerPerson?: BoolFieldUpdateOperationsInput | boolean
    textVertical?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingCreateInput = {
    id: string
    bookedBy: string
    bookedDate: Date | string
    email?: string | null
    phone: string
    checkIn: Date | string
    checkOut: Date | string
    guests?: JsonNullValueInput | InputJsonValue
    notes?: string | null
    isConfirmed?: boolean
    confirmedBy?: string | null
    confirmedDate?: Date | string | null
    isPaid?: boolean
    paymentMethod?: $Enums.PaymentMethod | null
    paymentDate?: Date | string | null
    paidBy?: string | null
    amount?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    room: RoomCreateNestedOneWithoutBookingsInput
  }

  export type BookingUncheckedCreateInput = {
    id: string
    roomId: string
    bookedBy: string
    bookedDate: Date | string
    email?: string | null
    phone: string
    checkIn: Date | string
    checkOut: Date | string
    guests?: JsonNullValueInput | InputJsonValue
    notes?: string | null
    isConfirmed?: boolean
    confirmedBy?: string | null
    confirmedDate?: Date | string | null
    isPaid?: boolean
    paymentMethod?: $Enums.PaymentMethod | null
    paymentDate?: Date | string | null
    paidBy?: string | null
    amount?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookedBy?: StringFieldUpdateOperationsInput | string
    bookedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    checkIn?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOut?: DateTimeFieldUpdateOperationsInput | Date | string
    guests?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    isConfirmed?: BoolFieldUpdateOperationsInput | boolean
    confirmedBy?: NullableStringFieldUpdateOperationsInput | string | null
    confirmedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    paymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paidBy?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    room?: RoomUpdateOneRequiredWithoutBookingsNestedInput
  }

  export type BookingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    bookedBy?: StringFieldUpdateOperationsInput | string
    bookedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    checkIn?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOut?: DateTimeFieldUpdateOperationsInput | Date | string
    guests?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    isConfirmed?: BoolFieldUpdateOperationsInput | boolean
    confirmedBy?: NullableStringFieldUpdateOperationsInput | string | null
    confirmedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    paymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paidBy?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingCreateManyInput = {
    id: string
    roomId: string
    bookedBy: string
    bookedDate: Date | string
    email?: string | null
    phone: string
    checkIn: Date | string
    checkOut: Date | string
    guests?: JsonNullValueInput | InputJsonValue
    notes?: string | null
    isConfirmed?: boolean
    confirmedBy?: string | null
    confirmedDate?: Date | string | null
    isPaid?: boolean
    paymentMethod?: $Enums.PaymentMethod | null
    paymentDate?: Date | string | null
    paidBy?: string | null
    amount?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookedBy?: StringFieldUpdateOperationsInput | string
    bookedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    checkIn?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOut?: DateTimeFieldUpdateOperationsInput | Date | string
    guests?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    isConfirmed?: BoolFieldUpdateOperationsInput | boolean
    confirmedBy?: NullableStringFieldUpdateOperationsInput | string | null
    confirmedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    paymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paidBy?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    bookedBy?: StringFieldUpdateOperationsInput | string
    bookedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    checkIn?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOut?: DateTimeFieldUpdateOperationsInput | Date | string
    guests?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    isConfirmed?: BoolFieldUpdateOperationsInput | boolean
    confirmedBy?: NullableStringFieldUpdateOperationsInput | string | null
    confirmedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    paymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paidBy?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StairsCreateInput = {
    id: string
    floor: $Enums.FloorType
    position?: JsonNullValueInput | InputJsonValue
    width: number
    height: number
    direction: $Enums.StairsDirection
    targetFloor?: $Enums.FloorType | null
    createdAt?: Date | string
    updatedAt?: Date | string
    hotel: HotelCreateNestedOneWithoutStairsInput
  }

  export type StairsUncheckedCreateInput = {
    id: string
    hotelId: string
    floor: $Enums.FloorType
    position?: JsonNullValueInput | InputJsonValue
    width: number
    height: number
    direction: $Enums.StairsDirection
    targetFloor?: $Enums.FloorType | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StairsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    floor?: EnumFloorTypeFieldUpdateOperationsInput | $Enums.FloorType
    position?: JsonNullValueInput | InputJsonValue
    width?: IntFieldUpdateOperationsInput | number
    height?: IntFieldUpdateOperationsInput | number
    direction?: EnumStairsDirectionFieldUpdateOperationsInput | $Enums.StairsDirection
    targetFloor?: NullableEnumFloorTypeFieldUpdateOperationsInput | $Enums.FloorType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hotel?: HotelUpdateOneRequiredWithoutStairsNestedInput
  }

  export type StairsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    hotelId?: StringFieldUpdateOperationsInput | string
    floor?: EnumFloorTypeFieldUpdateOperationsInput | $Enums.FloorType
    position?: JsonNullValueInput | InputJsonValue
    width?: IntFieldUpdateOperationsInput | number
    height?: IntFieldUpdateOperationsInput | number
    direction?: EnumStairsDirectionFieldUpdateOperationsInput | $Enums.StairsDirection
    targetFloor?: NullableEnumFloorTypeFieldUpdateOperationsInput | $Enums.FloorType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StairsCreateManyInput = {
    id: string
    hotelId: string
    floor: $Enums.FloorType
    position?: JsonNullValueInput | InputJsonValue
    width: number
    height: number
    direction: $Enums.StairsDirection
    targetFloor?: $Enums.FloorType | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StairsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    floor?: EnumFloorTypeFieldUpdateOperationsInput | $Enums.FloorType
    position?: JsonNullValueInput | InputJsonValue
    width?: IntFieldUpdateOperationsInput | number
    height?: IntFieldUpdateOperationsInput | number
    direction?: EnumStairsDirectionFieldUpdateOperationsInput | $Enums.StairsDirection
    targetFloor?: NullableEnumFloorTypeFieldUpdateOperationsInput | $Enums.FloorType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StairsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    hotelId?: StringFieldUpdateOperationsInput | string
    floor?: EnumFloorTypeFieldUpdateOperationsInput | $Enums.FloorType
    position?: JsonNullValueInput | InputJsonValue
    width?: IntFieldUpdateOperationsInput | number
    height?: IntFieldUpdateOperationsInput | number
    direction?: EnumStairsDirectionFieldUpdateOperationsInput | $Enums.StairsDirection
    targetFloor?: NullableEnumFloorTypeFieldUpdateOperationsInput | $Enums.FloorType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InviteCreateInput = {
    id: string
    token: string
    createdAt: Date | string
    expiresAt: Date | string
    used?: boolean
    name: string
    usedAt?: Date | string | null
    creator?: UserCreateNestedOneWithoutCreatedInvitesInput
    user?: UserCreateNestedOneWithoutUsedInvitesInput
  }

  export type InviteUncheckedCreateInput = {
    id: string
    token: string
    createdBy: string
    createdAt: Date | string
    expiresAt: Date | string
    used?: boolean
    name: string
    usedBy?: string | null
    usedAt?: Date | string | null
  }

  export type InviteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    name?: StringFieldUpdateOperationsInput | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    creator?: UserUpdateOneWithoutCreatedInvitesNestedInput
    user?: UserUpdateOneWithoutUsedInvitesNestedInput
  }

  export type InviteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    name?: StringFieldUpdateOperationsInput | string
    usedBy?: NullableStringFieldUpdateOperationsInput | string | null
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type InviteCreateManyInput = {
    id: string
    token: string
    createdBy: string
    createdAt: Date | string
    expiresAt: Date | string
    used?: boolean
    name: string
    usedBy?: string | null
    usedAt?: Date | string | null
  }

  export type InviteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    name?: StringFieldUpdateOperationsInput | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type InviteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    name?: StringFieldUpdateOperationsInput | string
    usedBy?: NullableStringFieldUpdateOperationsInput | string | null
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type FeedbackCreateInput = {
    id?: string
    userName: string
    userEmail?: string | null
    userRole: string
    comment: string
    screenshot?: string | null
    userAgent?: string | null
    isProcessed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FeedbackUncheckedCreateInput = {
    id?: string
    userName: string
    userEmail?: string | null
    userRole: string
    comment: string
    screenshot?: string | null
    userAgent?: string | null
    isProcessed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FeedbackUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userEmail?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: StringFieldUpdateOperationsInput | string
    comment?: StringFieldUpdateOperationsInput | string
    screenshot?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    isProcessed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeedbackUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userEmail?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: StringFieldUpdateOperationsInput | string
    comment?: StringFieldUpdateOperationsInput | string
    screenshot?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    isProcessed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeedbackCreateManyInput = {
    id?: string
    userName: string
    userEmail?: string | null
    userRole: string
    comment: string
    screenshot?: string | null
    userAgent?: string | null
    isProcessed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FeedbackUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userEmail?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: StringFieldUpdateOperationsInput | string
    comment?: StringFieldUpdateOperationsInput | string
    screenshot?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    isProcessed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeedbackUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userEmail?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: StringFieldUpdateOperationsInput | string
    comment?: StringFieldUpdateOperationsInput | string
    screenshot?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    isProcessed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RegistrationTokenCreateInput = {
    id?: string
    token: string
    originalToken?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RegistrationTokenUncheckedCreateInput = {
    id?: string
    token: string
    originalToken?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RegistrationTokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    originalToken?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RegistrationTokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    originalToken?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RegistrationTokenCreateManyInput = {
    id?: string
    token: string
    originalToken?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RegistrationTokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    originalToken?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RegistrationTokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    originalToken?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingDateRangeCreateInput = {
    id?: string
    name?: string | null
    startDate: Date | string
    endDate: Date | string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookingDateRangeUncheckedCreateInput = {
    id?: string
    name?: string | null
    startDate: Date | string
    endDate: Date | string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookingDateRangeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingDateRangeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingDateRangeCreateManyInput = {
    id?: string
    name?: string | null
    startDate: Date | string
    endDate: Date | string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookingDateRangeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingDateRangeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type InviteListRelationFilter = {
    every?: InviteWhereInput
    some?: InviteWhereInput
    none?: InviteWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type InviteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    phone?: SortOrder
    role?: SortOrder
    isProfileComplete?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    phone?: SortOrder
    role?: SortOrder
    isProfileComplete?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    phone?: SortOrder
    role?: SortOrder
    isProfileComplete?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BytesNullableFilter<$PrismaModel = never> = {
    equals?: Bytes | BytesFieldRefInput<$PrismaModel> | null
    in?: Bytes[] | ListBytesFieldRefInput<$PrismaModel> | null
    notIn?: Bytes[] | ListBytesFieldRefInput<$PrismaModel> | null
    not?: NestedBytesNullableFilter<$PrismaModel> | Bytes | null
  }

  export type RoomListRelationFilter = {
    every?: RoomWhereInput
    some?: RoomWhereInput
    none?: RoomWhereInput
  }

  export type StairsListRelationFilter = {
    every?: StairsWhereInput
    some?: StairsWhereInput
    none?: StairsWhereInput
  }

  export type RoomOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StairsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type HotelCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    description?: SortOrder
    floors?: SortOrder
    hasEGFloor?: SortOrder
    image?: SortOrder
    displayOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type HotelAvgOrderByAggregateInput = {
    floors?: SortOrder
    displayOrder?: SortOrder
  }

  export type HotelMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    description?: SortOrder
    floors?: SortOrder
    hasEGFloor?: SortOrder
    image?: SortOrder
    displayOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type HotelMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    description?: SortOrder
    floors?: SortOrder
    hasEGFloor?: SortOrder
    image?: SortOrder
    displayOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type HotelSumOrderByAggregateInput = {
    floors?: SortOrder
    displayOrder?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BytesNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Bytes | BytesFieldRefInput<$PrismaModel> | null
    in?: Bytes[] | ListBytesFieldRefInput<$PrismaModel> | null
    notIn?: Bytes[] | ListBytesFieldRefInput<$PrismaModel> | null
    not?: NestedBytesNullableWithAggregatesFilter<$PrismaModel> | Bytes | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBytesNullableFilter<$PrismaModel>
    _max?: NestedBytesNullableFilter<$PrismaModel>
  }

  export type EnumRoomTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.RoomType | EnumRoomTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RoomType[] | ListEnumRoomTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RoomType[] | ListEnumRoomTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRoomTypeFilter<$PrismaModel> | $Enums.RoomType
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type EnumFloorTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.FloorType | EnumFloorTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FloorType[] | ListEnumFloorTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FloorType[] | ListEnumFloorTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFloorTypeFilter<$PrismaModel> | $Enums.FloorType
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type HotelScalarRelationFilter = {
    is?: HotelWhereInput
    isNot?: HotelWhereInput
  }

  export type BookingListRelationFilter = {
    every?: BookingWhereInput
    some?: BookingWhereInput
    none?: BookingWhereInput
  }

  export type BookingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RoomCountOrderByAggregateInput = {
    id?: SortOrder
    number?: SortOrder
    hotelId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    capacity?: SortOrder
    maxCapacity?: SortOrder
    beds?: SortOrder
    floor?: SortOrder
    price?: SortOrder
    position?: SortOrder
    width?: SortOrder
    height?: SortOrder
    isCommon?: SortOrder
    zIndex?: SortOrder
    description?: SortOrder
    hasShower?: SortOrder
    hasToilet?: SortOrder
    pricePerPerson?: SortOrder
    textVertical?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoomAvgOrderByAggregateInput = {
    maxCapacity?: SortOrder
    price?: SortOrder
    width?: SortOrder
    height?: SortOrder
    zIndex?: SortOrder
  }

  export type RoomMaxOrderByAggregateInput = {
    id?: SortOrder
    number?: SortOrder
    hotelId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    capacity?: SortOrder
    maxCapacity?: SortOrder
    floor?: SortOrder
    price?: SortOrder
    width?: SortOrder
    height?: SortOrder
    isCommon?: SortOrder
    zIndex?: SortOrder
    description?: SortOrder
    hasShower?: SortOrder
    hasToilet?: SortOrder
    pricePerPerson?: SortOrder
    textVertical?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoomMinOrderByAggregateInput = {
    id?: SortOrder
    number?: SortOrder
    hotelId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    capacity?: SortOrder
    maxCapacity?: SortOrder
    floor?: SortOrder
    price?: SortOrder
    width?: SortOrder
    height?: SortOrder
    isCommon?: SortOrder
    zIndex?: SortOrder
    description?: SortOrder
    hasShower?: SortOrder
    hasToilet?: SortOrder
    pricePerPerson?: SortOrder
    textVertical?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoomSumOrderByAggregateInput = {
    maxCapacity?: SortOrder
    price?: SortOrder
    width?: SortOrder
    height?: SortOrder
    zIndex?: SortOrder
  }

  export type EnumRoomTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RoomType | EnumRoomTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RoomType[] | ListEnumRoomTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RoomType[] | ListEnumRoomTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRoomTypeWithAggregatesFilter<$PrismaModel> | $Enums.RoomType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoomTypeFilter<$PrismaModel>
    _max?: NestedEnumRoomTypeFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type EnumFloorTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FloorType | EnumFloorTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FloorType[] | ListEnumFloorTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FloorType[] | ListEnumFloorTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFloorTypeWithAggregatesFilter<$PrismaModel> | $Enums.FloorType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFloorTypeFilter<$PrismaModel>
    _max?: NestedEnumFloorTypeFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type EnumPaymentMethodNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel> | null
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPaymentMethodNullableFilter<$PrismaModel> | $Enums.PaymentMethod | null
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type RoomScalarRelationFilter = {
    is?: RoomWhereInput
    isNot?: RoomWhereInput
  }

  export type BookingCountOrderByAggregateInput = {
    id?: SortOrder
    roomId?: SortOrder
    bookedBy?: SortOrder
    bookedDate?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    checkIn?: SortOrder
    checkOut?: SortOrder
    guests?: SortOrder
    notes?: SortOrder
    isConfirmed?: SortOrder
    confirmedBy?: SortOrder
    confirmedDate?: SortOrder
    isPaid?: SortOrder
    paymentMethod?: SortOrder
    paymentDate?: SortOrder
    paidBy?: SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BookingAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type BookingMaxOrderByAggregateInput = {
    id?: SortOrder
    roomId?: SortOrder
    bookedBy?: SortOrder
    bookedDate?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    checkIn?: SortOrder
    checkOut?: SortOrder
    notes?: SortOrder
    isConfirmed?: SortOrder
    confirmedBy?: SortOrder
    confirmedDate?: SortOrder
    isPaid?: SortOrder
    paymentMethod?: SortOrder
    paymentDate?: SortOrder
    paidBy?: SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BookingMinOrderByAggregateInput = {
    id?: SortOrder
    roomId?: SortOrder
    bookedBy?: SortOrder
    bookedDate?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    checkIn?: SortOrder
    checkOut?: SortOrder
    notes?: SortOrder
    isConfirmed?: SortOrder
    confirmedBy?: SortOrder
    confirmedDate?: SortOrder
    isPaid?: SortOrder
    paymentMethod?: SortOrder
    paymentDate?: SortOrder
    paidBy?: SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BookingSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumPaymentMethodNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel> | null
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPaymentMethodNullableWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethod | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPaymentMethodNullableFilter<$PrismaModel>
    _max?: NestedEnumPaymentMethodNullableFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type EnumStairsDirectionFilter<$PrismaModel = never> = {
    equals?: $Enums.StairsDirection | EnumStairsDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.StairsDirection[] | ListEnumStairsDirectionFieldRefInput<$PrismaModel>
    notIn?: $Enums.StairsDirection[] | ListEnumStairsDirectionFieldRefInput<$PrismaModel>
    not?: NestedEnumStairsDirectionFilter<$PrismaModel> | $Enums.StairsDirection
  }

  export type EnumFloorTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.FloorType | EnumFloorTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.FloorType[] | ListEnumFloorTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.FloorType[] | ListEnumFloorTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumFloorTypeNullableFilter<$PrismaModel> | $Enums.FloorType | null
  }

  export type StairsCountOrderByAggregateInput = {
    id?: SortOrder
    hotelId?: SortOrder
    floor?: SortOrder
    position?: SortOrder
    width?: SortOrder
    height?: SortOrder
    direction?: SortOrder
    targetFloor?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StairsAvgOrderByAggregateInput = {
    width?: SortOrder
    height?: SortOrder
  }

  export type StairsMaxOrderByAggregateInput = {
    id?: SortOrder
    hotelId?: SortOrder
    floor?: SortOrder
    width?: SortOrder
    height?: SortOrder
    direction?: SortOrder
    targetFloor?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StairsMinOrderByAggregateInput = {
    id?: SortOrder
    hotelId?: SortOrder
    floor?: SortOrder
    width?: SortOrder
    height?: SortOrder
    direction?: SortOrder
    targetFloor?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StairsSumOrderByAggregateInput = {
    width?: SortOrder
    height?: SortOrder
  }

  export type EnumStairsDirectionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StairsDirection | EnumStairsDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.StairsDirection[] | ListEnumStairsDirectionFieldRefInput<$PrismaModel>
    notIn?: $Enums.StairsDirection[] | ListEnumStairsDirectionFieldRefInput<$PrismaModel>
    not?: NestedEnumStairsDirectionWithAggregatesFilter<$PrismaModel> | $Enums.StairsDirection
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStairsDirectionFilter<$PrismaModel>
    _max?: NestedEnumStairsDirectionFilter<$PrismaModel>
  }

  export type EnumFloorTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FloorType | EnumFloorTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.FloorType[] | ListEnumFloorTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.FloorType[] | ListEnumFloorTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumFloorTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.FloorType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumFloorTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumFloorTypeNullableFilter<$PrismaModel>
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type InviteCountOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    used?: SortOrder
    name?: SortOrder
    usedBy?: SortOrder
    usedAt?: SortOrder
  }

  export type InviteMaxOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    used?: SortOrder
    name?: SortOrder
    usedBy?: SortOrder
    usedAt?: SortOrder
  }

  export type InviteMinOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    used?: SortOrder
    name?: SortOrder
    usedBy?: SortOrder
    usedAt?: SortOrder
  }

  export type FeedbackCountOrderByAggregateInput = {
    id?: SortOrder
    userName?: SortOrder
    userEmail?: SortOrder
    userRole?: SortOrder
    comment?: SortOrder
    screenshot?: SortOrder
    userAgent?: SortOrder
    isProcessed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FeedbackMaxOrderByAggregateInput = {
    id?: SortOrder
    userName?: SortOrder
    userEmail?: SortOrder
    userRole?: SortOrder
    comment?: SortOrder
    screenshot?: SortOrder
    userAgent?: SortOrder
    isProcessed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FeedbackMinOrderByAggregateInput = {
    id?: SortOrder
    userName?: SortOrder
    userEmail?: SortOrder
    userRole?: SortOrder
    comment?: SortOrder
    screenshot?: SortOrder
    userAgent?: SortOrder
    isProcessed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RegistrationTokenCountOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    originalToken?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RegistrationTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    originalToken?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RegistrationTokenMinOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    originalToken?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BookingDateRangeCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BookingDateRangeMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BookingDateRangeMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InviteCreateNestedManyWithoutCreatorInput = {
    create?: XOR<InviteCreateWithoutCreatorInput, InviteUncheckedCreateWithoutCreatorInput> | InviteCreateWithoutCreatorInput[] | InviteUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: InviteCreateOrConnectWithoutCreatorInput | InviteCreateOrConnectWithoutCreatorInput[]
    createMany?: InviteCreateManyCreatorInputEnvelope
    connect?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
  }

  export type InviteCreateNestedManyWithoutUserInput = {
    create?: XOR<InviteCreateWithoutUserInput, InviteUncheckedCreateWithoutUserInput> | InviteCreateWithoutUserInput[] | InviteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InviteCreateOrConnectWithoutUserInput | InviteCreateOrConnectWithoutUserInput[]
    createMany?: InviteCreateManyUserInputEnvelope
    connect?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
  }

  export type InviteUncheckedCreateNestedManyWithoutCreatorInput = {
    create?: XOR<InviteCreateWithoutCreatorInput, InviteUncheckedCreateWithoutCreatorInput> | InviteCreateWithoutCreatorInput[] | InviteUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: InviteCreateOrConnectWithoutCreatorInput | InviteCreateOrConnectWithoutCreatorInput[]
    createMany?: InviteCreateManyCreatorInputEnvelope
    connect?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
  }

  export type InviteUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<InviteCreateWithoutUserInput, InviteUncheckedCreateWithoutUserInput> | InviteCreateWithoutUserInput[] | InviteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InviteCreateOrConnectWithoutUserInput | InviteCreateOrConnectWithoutUserInput[]
    createMany?: InviteCreateManyUserInputEnvelope
    connect?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type InviteUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<InviteCreateWithoutCreatorInput, InviteUncheckedCreateWithoutCreatorInput> | InviteCreateWithoutCreatorInput[] | InviteUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: InviteCreateOrConnectWithoutCreatorInput | InviteCreateOrConnectWithoutCreatorInput[]
    upsert?: InviteUpsertWithWhereUniqueWithoutCreatorInput | InviteUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: InviteCreateManyCreatorInputEnvelope
    set?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
    disconnect?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
    delete?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
    connect?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
    update?: InviteUpdateWithWhereUniqueWithoutCreatorInput | InviteUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: InviteUpdateManyWithWhereWithoutCreatorInput | InviteUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: InviteScalarWhereInput | InviteScalarWhereInput[]
  }

  export type InviteUpdateManyWithoutUserNestedInput = {
    create?: XOR<InviteCreateWithoutUserInput, InviteUncheckedCreateWithoutUserInput> | InviteCreateWithoutUserInput[] | InviteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InviteCreateOrConnectWithoutUserInput | InviteCreateOrConnectWithoutUserInput[]
    upsert?: InviteUpsertWithWhereUniqueWithoutUserInput | InviteUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: InviteCreateManyUserInputEnvelope
    set?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
    disconnect?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
    delete?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
    connect?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
    update?: InviteUpdateWithWhereUniqueWithoutUserInput | InviteUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: InviteUpdateManyWithWhereWithoutUserInput | InviteUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: InviteScalarWhereInput | InviteScalarWhereInput[]
  }

  export type InviteUncheckedUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<InviteCreateWithoutCreatorInput, InviteUncheckedCreateWithoutCreatorInput> | InviteCreateWithoutCreatorInput[] | InviteUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: InviteCreateOrConnectWithoutCreatorInput | InviteCreateOrConnectWithoutCreatorInput[]
    upsert?: InviteUpsertWithWhereUniqueWithoutCreatorInput | InviteUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: InviteCreateManyCreatorInputEnvelope
    set?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
    disconnect?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
    delete?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
    connect?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
    update?: InviteUpdateWithWhereUniqueWithoutCreatorInput | InviteUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: InviteUpdateManyWithWhereWithoutCreatorInput | InviteUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: InviteScalarWhereInput | InviteScalarWhereInput[]
  }

  export type InviteUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<InviteCreateWithoutUserInput, InviteUncheckedCreateWithoutUserInput> | InviteCreateWithoutUserInput[] | InviteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InviteCreateOrConnectWithoutUserInput | InviteCreateOrConnectWithoutUserInput[]
    upsert?: InviteUpsertWithWhereUniqueWithoutUserInput | InviteUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: InviteCreateManyUserInputEnvelope
    set?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
    disconnect?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
    delete?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
    connect?: InviteWhereUniqueInput | InviteWhereUniqueInput[]
    update?: InviteUpdateWithWhereUniqueWithoutUserInput | InviteUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: InviteUpdateManyWithWhereWithoutUserInput | InviteUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: InviteScalarWhereInput | InviteScalarWhereInput[]
  }

  export type RoomCreateNestedManyWithoutHotelInput = {
    create?: XOR<RoomCreateWithoutHotelInput, RoomUncheckedCreateWithoutHotelInput> | RoomCreateWithoutHotelInput[] | RoomUncheckedCreateWithoutHotelInput[]
    connectOrCreate?: RoomCreateOrConnectWithoutHotelInput | RoomCreateOrConnectWithoutHotelInput[]
    createMany?: RoomCreateManyHotelInputEnvelope
    connect?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
  }

  export type StairsCreateNestedManyWithoutHotelInput = {
    create?: XOR<StairsCreateWithoutHotelInput, StairsUncheckedCreateWithoutHotelInput> | StairsCreateWithoutHotelInput[] | StairsUncheckedCreateWithoutHotelInput[]
    connectOrCreate?: StairsCreateOrConnectWithoutHotelInput | StairsCreateOrConnectWithoutHotelInput[]
    createMany?: StairsCreateManyHotelInputEnvelope
    connect?: StairsWhereUniqueInput | StairsWhereUniqueInput[]
  }

  export type RoomUncheckedCreateNestedManyWithoutHotelInput = {
    create?: XOR<RoomCreateWithoutHotelInput, RoomUncheckedCreateWithoutHotelInput> | RoomCreateWithoutHotelInput[] | RoomUncheckedCreateWithoutHotelInput[]
    connectOrCreate?: RoomCreateOrConnectWithoutHotelInput | RoomCreateOrConnectWithoutHotelInput[]
    createMany?: RoomCreateManyHotelInputEnvelope
    connect?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
  }

  export type StairsUncheckedCreateNestedManyWithoutHotelInput = {
    create?: XOR<StairsCreateWithoutHotelInput, StairsUncheckedCreateWithoutHotelInput> | StairsCreateWithoutHotelInput[] | StairsUncheckedCreateWithoutHotelInput[]
    connectOrCreate?: StairsCreateOrConnectWithoutHotelInput | StairsCreateOrConnectWithoutHotelInput[]
    createMany?: StairsCreateManyHotelInputEnvelope
    connect?: StairsWhereUniqueInput | StairsWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableBytesFieldUpdateOperationsInput = {
    set?: Bytes | null
  }

  export type RoomUpdateManyWithoutHotelNestedInput = {
    create?: XOR<RoomCreateWithoutHotelInput, RoomUncheckedCreateWithoutHotelInput> | RoomCreateWithoutHotelInput[] | RoomUncheckedCreateWithoutHotelInput[]
    connectOrCreate?: RoomCreateOrConnectWithoutHotelInput | RoomCreateOrConnectWithoutHotelInput[]
    upsert?: RoomUpsertWithWhereUniqueWithoutHotelInput | RoomUpsertWithWhereUniqueWithoutHotelInput[]
    createMany?: RoomCreateManyHotelInputEnvelope
    set?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
    disconnect?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
    delete?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
    connect?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
    update?: RoomUpdateWithWhereUniqueWithoutHotelInput | RoomUpdateWithWhereUniqueWithoutHotelInput[]
    updateMany?: RoomUpdateManyWithWhereWithoutHotelInput | RoomUpdateManyWithWhereWithoutHotelInput[]
    deleteMany?: RoomScalarWhereInput | RoomScalarWhereInput[]
  }

  export type StairsUpdateManyWithoutHotelNestedInput = {
    create?: XOR<StairsCreateWithoutHotelInput, StairsUncheckedCreateWithoutHotelInput> | StairsCreateWithoutHotelInput[] | StairsUncheckedCreateWithoutHotelInput[]
    connectOrCreate?: StairsCreateOrConnectWithoutHotelInput | StairsCreateOrConnectWithoutHotelInput[]
    upsert?: StairsUpsertWithWhereUniqueWithoutHotelInput | StairsUpsertWithWhereUniqueWithoutHotelInput[]
    createMany?: StairsCreateManyHotelInputEnvelope
    set?: StairsWhereUniqueInput | StairsWhereUniqueInput[]
    disconnect?: StairsWhereUniqueInput | StairsWhereUniqueInput[]
    delete?: StairsWhereUniqueInput | StairsWhereUniqueInput[]
    connect?: StairsWhereUniqueInput | StairsWhereUniqueInput[]
    update?: StairsUpdateWithWhereUniqueWithoutHotelInput | StairsUpdateWithWhereUniqueWithoutHotelInput[]
    updateMany?: StairsUpdateManyWithWhereWithoutHotelInput | StairsUpdateManyWithWhereWithoutHotelInput[]
    deleteMany?: StairsScalarWhereInput | StairsScalarWhereInput[]
  }

  export type RoomUncheckedUpdateManyWithoutHotelNestedInput = {
    create?: XOR<RoomCreateWithoutHotelInput, RoomUncheckedCreateWithoutHotelInput> | RoomCreateWithoutHotelInput[] | RoomUncheckedCreateWithoutHotelInput[]
    connectOrCreate?: RoomCreateOrConnectWithoutHotelInput | RoomCreateOrConnectWithoutHotelInput[]
    upsert?: RoomUpsertWithWhereUniqueWithoutHotelInput | RoomUpsertWithWhereUniqueWithoutHotelInput[]
    createMany?: RoomCreateManyHotelInputEnvelope
    set?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
    disconnect?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
    delete?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
    connect?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
    update?: RoomUpdateWithWhereUniqueWithoutHotelInput | RoomUpdateWithWhereUniqueWithoutHotelInput[]
    updateMany?: RoomUpdateManyWithWhereWithoutHotelInput | RoomUpdateManyWithWhereWithoutHotelInput[]
    deleteMany?: RoomScalarWhereInput | RoomScalarWhereInput[]
  }

  export type StairsUncheckedUpdateManyWithoutHotelNestedInput = {
    create?: XOR<StairsCreateWithoutHotelInput, StairsUncheckedCreateWithoutHotelInput> | StairsCreateWithoutHotelInput[] | StairsUncheckedCreateWithoutHotelInput[]
    connectOrCreate?: StairsCreateOrConnectWithoutHotelInput | StairsCreateOrConnectWithoutHotelInput[]
    upsert?: StairsUpsertWithWhereUniqueWithoutHotelInput | StairsUpsertWithWhereUniqueWithoutHotelInput[]
    createMany?: StairsCreateManyHotelInputEnvelope
    set?: StairsWhereUniqueInput | StairsWhereUniqueInput[]
    disconnect?: StairsWhereUniqueInput | StairsWhereUniqueInput[]
    delete?: StairsWhereUniqueInput | StairsWhereUniqueInput[]
    connect?: StairsWhereUniqueInput | StairsWhereUniqueInput[]
    update?: StairsUpdateWithWhereUniqueWithoutHotelInput | StairsUpdateWithWhereUniqueWithoutHotelInput[]
    updateMany?: StairsUpdateManyWithWhereWithoutHotelInput | StairsUpdateManyWithWhereWithoutHotelInput[]
    deleteMany?: StairsScalarWhereInput | StairsScalarWhereInput[]
  }

  export type HotelCreateNestedOneWithoutRoomsInput = {
    create?: XOR<HotelCreateWithoutRoomsInput, HotelUncheckedCreateWithoutRoomsInput>
    connectOrCreate?: HotelCreateOrConnectWithoutRoomsInput
    connect?: HotelWhereUniqueInput
  }

  export type BookingCreateNestedManyWithoutRoomInput = {
    create?: XOR<BookingCreateWithoutRoomInput, BookingUncheckedCreateWithoutRoomInput> | BookingCreateWithoutRoomInput[] | BookingUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutRoomInput | BookingCreateOrConnectWithoutRoomInput[]
    createMany?: BookingCreateManyRoomInputEnvelope
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
  }

  export type BookingUncheckedCreateNestedManyWithoutRoomInput = {
    create?: XOR<BookingCreateWithoutRoomInput, BookingUncheckedCreateWithoutRoomInput> | BookingCreateWithoutRoomInput[] | BookingUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutRoomInput | BookingCreateOrConnectWithoutRoomInput[]
    createMany?: BookingCreateManyRoomInputEnvelope
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
  }

  export type EnumRoomTypeFieldUpdateOperationsInput = {
    set?: $Enums.RoomType
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumFloorTypeFieldUpdateOperationsInput = {
    set?: $Enums.FloorType
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type HotelUpdateOneRequiredWithoutRoomsNestedInput = {
    create?: XOR<HotelCreateWithoutRoomsInput, HotelUncheckedCreateWithoutRoomsInput>
    connectOrCreate?: HotelCreateOrConnectWithoutRoomsInput
    upsert?: HotelUpsertWithoutRoomsInput
    connect?: HotelWhereUniqueInput
    update?: XOR<XOR<HotelUpdateToOneWithWhereWithoutRoomsInput, HotelUpdateWithoutRoomsInput>, HotelUncheckedUpdateWithoutRoomsInput>
  }

  export type BookingUpdateManyWithoutRoomNestedInput = {
    create?: XOR<BookingCreateWithoutRoomInput, BookingUncheckedCreateWithoutRoomInput> | BookingCreateWithoutRoomInput[] | BookingUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutRoomInput | BookingCreateOrConnectWithoutRoomInput[]
    upsert?: BookingUpsertWithWhereUniqueWithoutRoomInput | BookingUpsertWithWhereUniqueWithoutRoomInput[]
    createMany?: BookingCreateManyRoomInputEnvelope
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    update?: BookingUpdateWithWhereUniqueWithoutRoomInput | BookingUpdateWithWhereUniqueWithoutRoomInput[]
    updateMany?: BookingUpdateManyWithWhereWithoutRoomInput | BookingUpdateManyWithWhereWithoutRoomInput[]
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[]
  }

  export type BookingUncheckedUpdateManyWithoutRoomNestedInput = {
    create?: XOR<BookingCreateWithoutRoomInput, BookingUncheckedCreateWithoutRoomInput> | BookingCreateWithoutRoomInput[] | BookingUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutRoomInput | BookingCreateOrConnectWithoutRoomInput[]
    upsert?: BookingUpsertWithWhereUniqueWithoutRoomInput | BookingUpsertWithWhereUniqueWithoutRoomInput[]
    createMany?: BookingCreateManyRoomInputEnvelope
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    update?: BookingUpdateWithWhereUniqueWithoutRoomInput | BookingUpdateWithWhereUniqueWithoutRoomInput[]
    updateMany?: BookingUpdateManyWithWhereWithoutRoomInput | BookingUpdateManyWithWhereWithoutRoomInput[]
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[]
  }

  export type RoomCreateNestedOneWithoutBookingsInput = {
    create?: XOR<RoomCreateWithoutBookingsInput, RoomUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: RoomCreateOrConnectWithoutBookingsInput
    connect?: RoomWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableEnumPaymentMethodFieldUpdateOperationsInput = {
    set?: $Enums.PaymentMethod | null
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type RoomUpdateOneRequiredWithoutBookingsNestedInput = {
    create?: XOR<RoomCreateWithoutBookingsInput, RoomUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: RoomCreateOrConnectWithoutBookingsInput
    upsert?: RoomUpsertWithoutBookingsInput
    connect?: RoomWhereUniqueInput
    update?: XOR<XOR<RoomUpdateToOneWithWhereWithoutBookingsInput, RoomUpdateWithoutBookingsInput>, RoomUncheckedUpdateWithoutBookingsInput>
  }

  export type HotelCreateNestedOneWithoutStairsInput = {
    create?: XOR<HotelCreateWithoutStairsInput, HotelUncheckedCreateWithoutStairsInput>
    connectOrCreate?: HotelCreateOrConnectWithoutStairsInput
    connect?: HotelWhereUniqueInput
  }

  export type EnumStairsDirectionFieldUpdateOperationsInput = {
    set?: $Enums.StairsDirection
  }

  export type NullableEnumFloorTypeFieldUpdateOperationsInput = {
    set?: $Enums.FloorType | null
  }

  export type HotelUpdateOneRequiredWithoutStairsNestedInput = {
    create?: XOR<HotelCreateWithoutStairsInput, HotelUncheckedCreateWithoutStairsInput>
    connectOrCreate?: HotelCreateOrConnectWithoutStairsInput
    upsert?: HotelUpsertWithoutStairsInput
    connect?: HotelWhereUniqueInput
    update?: XOR<XOR<HotelUpdateToOneWithWhereWithoutStairsInput, HotelUpdateWithoutStairsInput>, HotelUncheckedUpdateWithoutStairsInput>
  }

  export type UserCreateNestedOneWithoutCreatedInvitesInput = {
    create?: XOR<UserCreateWithoutCreatedInvitesInput, UserUncheckedCreateWithoutCreatedInvitesInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedInvitesInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutUsedInvitesInput = {
    create?: XOR<UserCreateWithoutUsedInvitesInput, UserUncheckedCreateWithoutUsedInvitesInput>
    connectOrCreate?: UserCreateOrConnectWithoutUsedInvitesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneWithoutCreatedInvitesNestedInput = {
    create?: XOR<UserCreateWithoutCreatedInvitesInput, UserUncheckedCreateWithoutCreatedInvitesInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedInvitesInput
    upsert?: UserUpsertWithoutCreatedInvitesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCreatedInvitesInput, UserUpdateWithoutCreatedInvitesInput>, UserUncheckedUpdateWithoutCreatedInvitesInput>
  }

  export type UserUpdateOneWithoutUsedInvitesNestedInput = {
    create?: XOR<UserCreateWithoutUsedInvitesInput, UserUncheckedCreateWithoutUsedInvitesInput>
    connectOrCreate?: UserCreateOrConnectWithoutUsedInvitesInput
    upsert?: UserUpsertWithoutUsedInvitesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUsedInvitesInput, UserUpdateWithoutUsedInvitesInput>, UserUncheckedUpdateWithoutUsedInvitesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBytesNullableFilter<$PrismaModel = never> = {
    equals?: Bytes | BytesFieldRefInput<$PrismaModel> | null
    in?: Bytes[] | ListBytesFieldRefInput<$PrismaModel> | null
    notIn?: Bytes[] | ListBytesFieldRefInput<$PrismaModel> | null
    not?: NestedBytesNullableFilter<$PrismaModel> | Bytes | null
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBytesNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Bytes | BytesFieldRefInput<$PrismaModel> | null
    in?: Bytes[] | ListBytesFieldRefInput<$PrismaModel> | null
    notIn?: Bytes[] | ListBytesFieldRefInput<$PrismaModel> | null
    not?: NestedBytesNullableWithAggregatesFilter<$PrismaModel> | Bytes | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBytesNullableFilter<$PrismaModel>
    _max?: NestedBytesNullableFilter<$PrismaModel>
  }

  export type NestedEnumRoomTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.RoomType | EnumRoomTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RoomType[] | ListEnumRoomTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RoomType[] | ListEnumRoomTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRoomTypeFilter<$PrismaModel> | $Enums.RoomType
  }

  export type NestedEnumFloorTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.FloorType | EnumFloorTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FloorType[] | ListEnumFloorTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FloorType[] | ListEnumFloorTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFloorTypeFilter<$PrismaModel> | $Enums.FloorType
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedEnumRoomTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RoomType | EnumRoomTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RoomType[] | ListEnumRoomTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RoomType[] | ListEnumRoomTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRoomTypeWithAggregatesFilter<$PrismaModel> | $Enums.RoomType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoomTypeFilter<$PrismaModel>
    _max?: NestedEnumRoomTypeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumFloorTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FloorType | EnumFloorTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FloorType[] | ListEnumFloorTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FloorType[] | ListEnumFloorTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFloorTypeWithAggregatesFilter<$PrismaModel> | $Enums.FloorType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFloorTypeFilter<$PrismaModel>
    _max?: NestedEnumFloorTypeFilter<$PrismaModel>
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumPaymentMethodNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel> | null
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPaymentMethodNullableFilter<$PrismaModel> | $Enums.PaymentMethod | null
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumPaymentMethodNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel> | null
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPaymentMethodNullableWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethod | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPaymentMethodNullableFilter<$PrismaModel>
    _max?: NestedEnumPaymentMethodNullableFilter<$PrismaModel>
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedEnumStairsDirectionFilter<$PrismaModel = never> = {
    equals?: $Enums.StairsDirection | EnumStairsDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.StairsDirection[] | ListEnumStairsDirectionFieldRefInput<$PrismaModel>
    notIn?: $Enums.StairsDirection[] | ListEnumStairsDirectionFieldRefInput<$PrismaModel>
    not?: NestedEnumStairsDirectionFilter<$PrismaModel> | $Enums.StairsDirection
  }

  export type NestedEnumFloorTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.FloorType | EnumFloorTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.FloorType[] | ListEnumFloorTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.FloorType[] | ListEnumFloorTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumFloorTypeNullableFilter<$PrismaModel> | $Enums.FloorType | null
  }

  export type NestedEnumStairsDirectionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StairsDirection | EnumStairsDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.StairsDirection[] | ListEnumStairsDirectionFieldRefInput<$PrismaModel>
    notIn?: $Enums.StairsDirection[] | ListEnumStairsDirectionFieldRefInput<$PrismaModel>
    not?: NestedEnumStairsDirectionWithAggregatesFilter<$PrismaModel> | $Enums.StairsDirection
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStairsDirectionFilter<$PrismaModel>
    _max?: NestedEnumStairsDirectionFilter<$PrismaModel>
  }

  export type NestedEnumFloorTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FloorType | EnumFloorTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.FloorType[] | ListEnumFloorTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.FloorType[] | ListEnumFloorTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumFloorTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.FloorType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumFloorTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumFloorTypeNullableFilter<$PrismaModel>
  }

  export type InviteCreateWithoutCreatorInput = {
    id: string
    token: string
    createdAt: Date | string
    expiresAt: Date | string
    used?: boolean
    name: string
    usedAt?: Date | string | null
    user?: UserCreateNestedOneWithoutUsedInvitesInput
  }

  export type InviteUncheckedCreateWithoutCreatorInput = {
    id: string
    token: string
    createdAt: Date | string
    expiresAt: Date | string
    used?: boolean
    name: string
    usedBy?: string | null
    usedAt?: Date | string | null
  }

  export type InviteCreateOrConnectWithoutCreatorInput = {
    where: InviteWhereUniqueInput
    create: XOR<InviteCreateWithoutCreatorInput, InviteUncheckedCreateWithoutCreatorInput>
  }

  export type InviteCreateManyCreatorInputEnvelope = {
    data: InviteCreateManyCreatorInput | InviteCreateManyCreatorInput[]
    skipDuplicates?: boolean
  }

  export type InviteCreateWithoutUserInput = {
    id: string
    token: string
    createdAt: Date | string
    expiresAt: Date | string
    used?: boolean
    name: string
    usedAt?: Date | string | null
    creator?: UserCreateNestedOneWithoutCreatedInvitesInput
  }

  export type InviteUncheckedCreateWithoutUserInput = {
    id: string
    token: string
    createdBy: string
    createdAt: Date | string
    expiresAt: Date | string
    used?: boolean
    name: string
    usedAt?: Date | string | null
  }

  export type InviteCreateOrConnectWithoutUserInput = {
    where: InviteWhereUniqueInput
    create: XOR<InviteCreateWithoutUserInput, InviteUncheckedCreateWithoutUserInput>
  }

  export type InviteCreateManyUserInputEnvelope = {
    data: InviteCreateManyUserInput | InviteCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type InviteUpsertWithWhereUniqueWithoutCreatorInput = {
    where: InviteWhereUniqueInput
    update: XOR<InviteUpdateWithoutCreatorInput, InviteUncheckedUpdateWithoutCreatorInput>
    create: XOR<InviteCreateWithoutCreatorInput, InviteUncheckedCreateWithoutCreatorInput>
  }

  export type InviteUpdateWithWhereUniqueWithoutCreatorInput = {
    where: InviteWhereUniqueInput
    data: XOR<InviteUpdateWithoutCreatorInput, InviteUncheckedUpdateWithoutCreatorInput>
  }

  export type InviteUpdateManyWithWhereWithoutCreatorInput = {
    where: InviteScalarWhereInput
    data: XOR<InviteUpdateManyMutationInput, InviteUncheckedUpdateManyWithoutCreatorInput>
  }

  export type InviteScalarWhereInput = {
    AND?: InviteScalarWhereInput | InviteScalarWhereInput[]
    OR?: InviteScalarWhereInput[]
    NOT?: InviteScalarWhereInput | InviteScalarWhereInput[]
    id?: StringFilter<"Invite"> | string
    token?: StringFilter<"Invite"> | string
    createdBy?: StringFilter<"Invite"> | string
    createdAt?: DateTimeFilter<"Invite"> | Date | string
    expiresAt?: DateTimeFilter<"Invite"> | Date | string
    used?: BoolFilter<"Invite"> | boolean
    name?: StringFilter<"Invite"> | string
    usedBy?: StringNullableFilter<"Invite"> | string | null
    usedAt?: DateTimeNullableFilter<"Invite"> | Date | string | null
  }

  export type InviteUpsertWithWhereUniqueWithoutUserInput = {
    where: InviteWhereUniqueInput
    update: XOR<InviteUpdateWithoutUserInput, InviteUncheckedUpdateWithoutUserInput>
    create: XOR<InviteCreateWithoutUserInput, InviteUncheckedCreateWithoutUserInput>
  }

  export type InviteUpdateWithWhereUniqueWithoutUserInput = {
    where: InviteWhereUniqueInput
    data: XOR<InviteUpdateWithoutUserInput, InviteUncheckedUpdateWithoutUserInput>
  }

  export type InviteUpdateManyWithWhereWithoutUserInput = {
    where: InviteScalarWhereInput
    data: XOR<InviteUpdateManyMutationInput, InviteUncheckedUpdateManyWithoutUserInput>
  }

  export type RoomCreateWithoutHotelInput = {
    id: string
    number: string
    name?: string | null
    type: $Enums.RoomType
    capacity: string
    maxCapacity: number
    beds?: JsonNullValueInput | InputJsonValue
    floor: $Enums.FloorType
    price?: Decimal | DecimalJsLike | number | string
    position?: JsonNullValueInput | InputJsonValue
    width?: number | null
    height?: number | null
    isCommon?: boolean
    zIndex?: number
    description?: string | null
    hasShower?: boolean
    hasToilet?: boolean
    pricePerPerson?: boolean
    textVertical?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    bookings?: BookingCreateNestedManyWithoutRoomInput
  }

  export type RoomUncheckedCreateWithoutHotelInput = {
    id: string
    number: string
    name?: string | null
    type: $Enums.RoomType
    capacity: string
    maxCapacity: number
    beds?: JsonNullValueInput | InputJsonValue
    floor: $Enums.FloorType
    price?: Decimal | DecimalJsLike | number | string
    position?: JsonNullValueInput | InputJsonValue
    width?: number | null
    height?: number | null
    isCommon?: boolean
    zIndex?: number
    description?: string | null
    hasShower?: boolean
    hasToilet?: boolean
    pricePerPerson?: boolean
    textVertical?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    bookings?: BookingUncheckedCreateNestedManyWithoutRoomInput
  }

  export type RoomCreateOrConnectWithoutHotelInput = {
    where: RoomWhereUniqueInput
    create: XOR<RoomCreateWithoutHotelInput, RoomUncheckedCreateWithoutHotelInput>
  }

  export type RoomCreateManyHotelInputEnvelope = {
    data: RoomCreateManyHotelInput | RoomCreateManyHotelInput[]
    skipDuplicates?: boolean
  }

  export type StairsCreateWithoutHotelInput = {
    id: string
    floor: $Enums.FloorType
    position?: JsonNullValueInput | InputJsonValue
    width: number
    height: number
    direction: $Enums.StairsDirection
    targetFloor?: $Enums.FloorType | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StairsUncheckedCreateWithoutHotelInput = {
    id: string
    floor: $Enums.FloorType
    position?: JsonNullValueInput | InputJsonValue
    width: number
    height: number
    direction: $Enums.StairsDirection
    targetFloor?: $Enums.FloorType | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StairsCreateOrConnectWithoutHotelInput = {
    where: StairsWhereUniqueInput
    create: XOR<StairsCreateWithoutHotelInput, StairsUncheckedCreateWithoutHotelInput>
  }

  export type StairsCreateManyHotelInputEnvelope = {
    data: StairsCreateManyHotelInput | StairsCreateManyHotelInput[]
    skipDuplicates?: boolean
  }

  export type RoomUpsertWithWhereUniqueWithoutHotelInput = {
    where: RoomWhereUniqueInput
    update: XOR<RoomUpdateWithoutHotelInput, RoomUncheckedUpdateWithoutHotelInput>
    create: XOR<RoomCreateWithoutHotelInput, RoomUncheckedCreateWithoutHotelInput>
  }

  export type RoomUpdateWithWhereUniqueWithoutHotelInput = {
    where: RoomWhereUniqueInput
    data: XOR<RoomUpdateWithoutHotelInput, RoomUncheckedUpdateWithoutHotelInput>
  }

  export type RoomUpdateManyWithWhereWithoutHotelInput = {
    where: RoomScalarWhereInput
    data: XOR<RoomUpdateManyMutationInput, RoomUncheckedUpdateManyWithoutHotelInput>
  }

  export type RoomScalarWhereInput = {
    AND?: RoomScalarWhereInput | RoomScalarWhereInput[]
    OR?: RoomScalarWhereInput[]
    NOT?: RoomScalarWhereInput | RoomScalarWhereInput[]
    id?: StringFilter<"Room"> | string
    number?: StringFilter<"Room"> | string
    hotelId?: StringFilter<"Room"> | string
    name?: StringNullableFilter<"Room"> | string | null
    type?: EnumRoomTypeFilter<"Room"> | $Enums.RoomType
    capacity?: StringFilter<"Room"> | string
    maxCapacity?: IntFilter<"Room"> | number
    beds?: JsonFilter<"Room">
    floor?: EnumFloorTypeFilter<"Room"> | $Enums.FloorType
    price?: DecimalFilter<"Room"> | Decimal | DecimalJsLike | number | string
    position?: JsonFilter<"Room">
    width?: IntNullableFilter<"Room"> | number | null
    height?: IntNullableFilter<"Room"> | number | null
    isCommon?: BoolFilter<"Room"> | boolean
    zIndex?: IntFilter<"Room"> | number
    description?: StringNullableFilter<"Room"> | string | null
    hasShower?: BoolFilter<"Room"> | boolean
    hasToilet?: BoolFilter<"Room"> | boolean
    pricePerPerson?: BoolFilter<"Room"> | boolean
    textVertical?: BoolFilter<"Room"> | boolean
    createdAt?: DateTimeFilter<"Room"> | Date | string
    updatedAt?: DateTimeFilter<"Room"> | Date | string
  }

  export type StairsUpsertWithWhereUniqueWithoutHotelInput = {
    where: StairsWhereUniqueInput
    update: XOR<StairsUpdateWithoutHotelInput, StairsUncheckedUpdateWithoutHotelInput>
    create: XOR<StairsCreateWithoutHotelInput, StairsUncheckedCreateWithoutHotelInput>
  }

  export type StairsUpdateWithWhereUniqueWithoutHotelInput = {
    where: StairsWhereUniqueInput
    data: XOR<StairsUpdateWithoutHotelInput, StairsUncheckedUpdateWithoutHotelInput>
  }

  export type StairsUpdateManyWithWhereWithoutHotelInput = {
    where: StairsScalarWhereInput
    data: XOR<StairsUpdateManyMutationInput, StairsUncheckedUpdateManyWithoutHotelInput>
  }

  export type StairsScalarWhereInput = {
    AND?: StairsScalarWhereInput | StairsScalarWhereInput[]
    OR?: StairsScalarWhereInput[]
    NOT?: StairsScalarWhereInput | StairsScalarWhereInput[]
    id?: StringFilter<"Stairs"> | string
    hotelId?: StringFilter<"Stairs"> | string
    floor?: EnumFloorTypeFilter<"Stairs"> | $Enums.FloorType
    position?: JsonFilter<"Stairs">
    width?: IntFilter<"Stairs"> | number
    height?: IntFilter<"Stairs"> | number
    direction?: EnumStairsDirectionFilter<"Stairs"> | $Enums.StairsDirection
    targetFloor?: EnumFloorTypeNullableFilter<"Stairs"> | $Enums.FloorType | null
    createdAt?: DateTimeFilter<"Stairs"> | Date | string
    updatedAt?: DateTimeFilter<"Stairs"> | Date | string
  }

  export type HotelCreateWithoutRoomsInput = {
    id: string
    name: string
    address: string
    description?: string | null
    floors?: number | null
    hasEGFloor?: boolean
    image?: Bytes | null
    displayOrder?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    stairs?: StairsCreateNestedManyWithoutHotelInput
  }

  export type HotelUncheckedCreateWithoutRoomsInput = {
    id: string
    name: string
    address: string
    description?: string | null
    floors?: number | null
    hasEGFloor?: boolean
    image?: Bytes | null
    displayOrder?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    stairs?: StairsUncheckedCreateNestedManyWithoutHotelInput
  }

  export type HotelCreateOrConnectWithoutRoomsInput = {
    where: HotelWhereUniqueInput
    create: XOR<HotelCreateWithoutRoomsInput, HotelUncheckedCreateWithoutRoomsInput>
  }

  export type BookingCreateWithoutRoomInput = {
    id: string
    bookedBy: string
    bookedDate: Date | string
    email?: string | null
    phone: string
    checkIn: Date | string
    checkOut: Date | string
    guests?: JsonNullValueInput | InputJsonValue
    notes?: string | null
    isConfirmed?: boolean
    confirmedBy?: string | null
    confirmedDate?: Date | string | null
    isPaid?: boolean
    paymentMethod?: $Enums.PaymentMethod | null
    paymentDate?: Date | string | null
    paidBy?: string | null
    amount?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookingUncheckedCreateWithoutRoomInput = {
    id: string
    bookedBy: string
    bookedDate: Date | string
    email?: string | null
    phone: string
    checkIn: Date | string
    checkOut: Date | string
    guests?: JsonNullValueInput | InputJsonValue
    notes?: string | null
    isConfirmed?: boolean
    confirmedBy?: string | null
    confirmedDate?: Date | string | null
    isPaid?: boolean
    paymentMethod?: $Enums.PaymentMethod | null
    paymentDate?: Date | string | null
    paidBy?: string | null
    amount?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookingCreateOrConnectWithoutRoomInput = {
    where: BookingWhereUniqueInput
    create: XOR<BookingCreateWithoutRoomInput, BookingUncheckedCreateWithoutRoomInput>
  }

  export type BookingCreateManyRoomInputEnvelope = {
    data: BookingCreateManyRoomInput | BookingCreateManyRoomInput[]
    skipDuplicates?: boolean
  }

  export type HotelUpsertWithoutRoomsInput = {
    update: XOR<HotelUpdateWithoutRoomsInput, HotelUncheckedUpdateWithoutRoomsInput>
    create: XOR<HotelCreateWithoutRoomsInput, HotelUncheckedCreateWithoutRoomsInput>
    where?: HotelWhereInput
  }

  export type HotelUpdateToOneWithWhereWithoutRoomsInput = {
    where?: HotelWhereInput
    data: XOR<HotelUpdateWithoutRoomsInput, HotelUncheckedUpdateWithoutRoomsInput>
  }

  export type HotelUpdateWithoutRoomsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    floors?: NullableIntFieldUpdateOperationsInput | number | null
    hasEGFloor?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableBytesFieldUpdateOperationsInput | Bytes | null
    displayOrder?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stairs?: StairsUpdateManyWithoutHotelNestedInput
  }

  export type HotelUncheckedUpdateWithoutRoomsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    floors?: NullableIntFieldUpdateOperationsInput | number | null
    hasEGFloor?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableBytesFieldUpdateOperationsInput | Bytes | null
    displayOrder?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stairs?: StairsUncheckedUpdateManyWithoutHotelNestedInput
  }

  export type BookingUpsertWithWhereUniqueWithoutRoomInput = {
    where: BookingWhereUniqueInput
    update: XOR<BookingUpdateWithoutRoomInput, BookingUncheckedUpdateWithoutRoomInput>
    create: XOR<BookingCreateWithoutRoomInput, BookingUncheckedCreateWithoutRoomInput>
  }

  export type BookingUpdateWithWhereUniqueWithoutRoomInput = {
    where: BookingWhereUniqueInput
    data: XOR<BookingUpdateWithoutRoomInput, BookingUncheckedUpdateWithoutRoomInput>
  }

  export type BookingUpdateManyWithWhereWithoutRoomInput = {
    where: BookingScalarWhereInput
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyWithoutRoomInput>
  }

  export type BookingScalarWhereInput = {
    AND?: BookingScalarWhereInput | BookingScalarWhereInput[]
    OR?: BookingScalarWhereInput[]
    NOT?: BookingScalarWhereInput | BookingScalarWhereInput[]
    id?: StringFilter<"Booking"> | string
    roomId?: StringFilter<"Booking"> | string
    bookedBy?: StringFilter<"Booking"> | string
    bookedDate?: DateTimeFilter<"Booking"> | Date | string
    email?: StringNullableFilter<"Booking"> | string | null
    phone?: StringFilter<"Booking"> | string
    checkIn?: DateTimeFilter<"Booking"> | Date | string
    checkOut?: DateTimeFilter<"Booking"> | Date | string
    guests?: JsonFilter<"Booking">
    notes?: StringNullableFilter<"Booking"> | string | null
    isConfirmed?: BoolFilter<"Booking"> | boolean
    confirmedBy?: StringNullableFilter<"Booking"> | string | null
    confirmedDate?: DateTimeNullableFilter<"Booking"> | Date | string | null
    isPaid?: BoolFilter<"Booking"> | boolean
    paymentMethod?: EnumPaymentMethodNullableFilter<"Booking"> | $Enums.PaymentMethod | null
    paymentDate?: DateTimeNullableFilter<"Booking"> | Date | string | null
    paidBy?: StringNullableFilter<"Booking"> | string | null
    amount?: DecimalNullableFilter<"Booking"> | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFilter<"Booking"> | Date | string
    updatedAt?: DateTimeFilter<"Booking"> | Date | string
  }

  export type RoomCreateWithoutBookingsInput = {
    id: string
    number: string
    name?: string | null
    type: $Enums.RoomType
    capacity: string
    maxCapacity: number
    beds?: JsonNullValueInput | InputJsonValue
    floor: $Enums.FloorType
    price?: Decimal | DecimalJsLike | number | string
    position?: JsonNullValueInput | InputJsonValue
    width?: number | null
    height?: number | null
    isCommon?: boolean
    zIndex?: number
    description?: string | null
    hasShower?: boolean
    hasToilet?: boolean
    pricePerPerson?: boolean
    textVertical?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    hotel: HotelCreateNestedOneWithoutRoomsInput
  }

  export type RoomUncheckedCreateWithoutBookingsInput = {
    id: string
    number: string
    hotelId: string
    name?: string | null
    type: $Enums.RoomType
    capacity: string
    maxCapacity: number
    beds?: JsonNullValueInput | InputJsonValue
    floor: $Enums.FloorType
    price?: Decimal | DecimalJsLike | number | string
    position?: JsonNullValueInput | InputJsonValue
    width?: number | null
    height?: number | null
    isCommon?: boolean
    zIndex?: number
    description?: string | null
    hasShower?: boolean
    hasToilet?: boolean
    pricePerPerson?: boolean
    textVertical?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoomCreateOrConnectWithoutBookingsInput = {
    where: RoomWhereUniqueInput
    create: XOR<RoomCreateWithoutBookingsInput, RoomUncheckedCreateWithoutBookingsInput>
  }

  export type RoomUpsertWithoutBookingsInput = {
    update: XOR<RoomUpdateWithoutBookingsInput, RoomUncheckedUpdateWithoutBookingsInput>
    create: XOR<RoomCreateWithoutBookingsInput, RoomUncheckedCreateWithoutBookingsInput>
    where?: RoomWhereInput
  }

  export type RoomUpdateToOneWithWhereWithoutBookingsInput = {
    where?: RoomWhereInput
    data: XOR<RoomUpdateWithoutBookingsInput, RoomUncheckedUpdateWithoutBookingsInput>
  }

  export type RoomUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    number?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumRoomTypeFieldUpdateOperationsInput | $Enums.RoomType
    capacity?: StringFieldUpdateOperationsInput | string
    maxCapacity?: IntFieldUpdateOperationsInput | number
    beds?: JsonNullValueInput | InputJsonValue
    floor?: EnumFloorTypeFieldUpdateOperationsInput | $Enums.FloorType
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    position?: JsonNullValueInput | InputJsonValue
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    isCommon?: BoolFieldUpdateOperationsInput | boolean
    zIndex?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    hasShower?: BoolFieldUpdateOperationsInput | boolean
    hasToilet?: BoolFieldUpdateOperationsInput | boolean
    pricePerPerson?: BoolFieldUpdateOperationsInput | boolean
    textVertical?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hotel?: HotelUpdateOneRequiredWithoutRoomsNestedInput
  }

  export type RoomUncheckedUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    number?: StringFieldUpdateOperationsInput | string
    hotelId?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumRoomTypeFieldUpdateOperationsInput | $Enums.RoomType
    capacity?: StringFieldUpdateOperationsInput | string
    maxCapacity?: IntFieldUpdateOperationsInput | number
    beds?: JsonNullValueInput | InputJsonValue
    floor?: EnumFloorTypeFieldUpdateOperationsInput | $Enums.FloorType
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    position?: JsonNullValueInput | InputJsonValue
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    isCommon?: BoolFieldUpdateOperationsInput | boolean
    zIndex?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    hasShower?: BoolFieldUpdateOperationsInput | boolean
    hasToilet?: BoolFieldUpdateOperationsInput | boolean
    pricePerPerson?: BoolFieldUpdateOperationsInput | boolean
    textVertical?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HotelCreateWithoutStairsInput = {
    id: string
    name: string
    address: string
    description?: string | null
    floors?: number | null
    hasEGFloor?: boolean
    image?: Bytes | null
    displayOrder?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    rooms?: RoomCreateNestedManyWithoutHotelInput
  }

  export type HotelUncheckedCreateWithoutStairsInput = {
    id: string
    name: string
    address: string
    description?: string | null
    floors?: number | null
    hasEGFloor?: boolean
    image?: Bytes | null
    displayOrder?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    rooms?: RoomUncheckedCreateNestedManyWithoutHotelInput
  }

  export type HotelCreateOrConnectWithoutStairsInput = {
    where: HotelWhereUniqueInput
    create: XOR<HotelCreateWithoutStairsInput, HotelUncheckedCreateWithoutStairsInput>
  }

  export type HotelUpsertWithoutStairsInput = {
    update: XOR<HotelUpdateWithoutStairsInput, HotelUncheckedUpdateWithoutStairsInput>
    create: XOR<HotelCreateWithoutStairsInput, HotelUncheckedCreateWithoutStairsInput>
    where?: HotelWhereInput
  }

  export type HotelUpdateToOneWithWhereWithoutStairsInput = {
    where?: HotelWhereInput
    data: XOR<HotelUpdateWithoutStairsInput, HotelUncheckedUpdateWithoutStairsInput>
  }

  export type HotelUpdateWithoutStairsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    floors?: NullableIntFieldUpdateOperationsInput | number | null
    hasEGFloor?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableBytesFieldUpdateOperationsInput | Bytes | null
    displayOrder?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rooms?: RoomUpdateManyWithoutHotelNestedInput
  }

  export type HotelUncheckedUpdateWithoutStairsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    floors?: NullableIntFieldUpdateOperationsInput | number | null
    hasEGFloor?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableBytesFieldUpdateOperationsInput | Bytes | null
    displayOrder?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rooms?: RoomUncheckedUpdateManyWithoutHotelNestedInput
  }

  export type UserCreateWithoutCreatedInvitesInput = {
    id: string
    email?: string | null
    name: string
    password?: string | null
    phone?: string | null
    role: $Enums.UserRole
    isProfileComplete?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    usedInvites?: InviteCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCreatedInvitesInput = {
    id: string
    email?: string | null
    name: string
    password?: string | null
    phone?: string | null
    role: $Enums.UserRole
    isProfileComplete?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    usedInvites?: InviteUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCreatedInvitesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCreatedInvitesInput, UserUncheckedCreateWithoutCreatedInvitesInput>
  }

  export type UserCreateWithoutUsedInvitesInput = {
    id: string
    email?: string | null
    name: string
    password?: string | null
    phone?: string | null
    role: $Enums.UserRole
    isProfileComplete?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    createdInvites?: InviteCreateNestedManyWithoutCreatorInput
  }

  export type UserUncheckedCreateWithoutUsedInvitesInput = {
    id: string
    email?: string | null
    name: string
    password?: string | null
    phone?: string | null
    role: $Enums.UserRole
    isProfileComplete?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    createdInvites?: InviteUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type UserCreateOrConnectWithoutUsedInvitesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUsedInvitesInput, UserUncheckedCreateWithoutUsedInvitesInput>
  }

  export type UserUpsertWithoutCreatedInvitesInput = {
    update: XOR<UserUpdateWithoutCreatedInvitesInput, UserUncheckedUpdateWithoutCreatedInvitesInput>
    create: XOR<UserCreateWithoutCreatedInvitesInput, UserUncheckedCreateWithoutCreatedInvitesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCreatedInvitesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCreatedInvitesInput, UserUncheckedUpdateWithoutCreatedInvitesInput>
  }

  export type UserUpdateWithoutCreatedInvitesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isProfileComplete?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedInvites?: InviteUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCreatedInvitesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isProfileComplete?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedInvites?: InviteUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutUsedInvitesInput = {
    update: XOR<UserUpdateWithoutUsedInvitesInput, UserUncheckedUpdateWithoutUsedInvitesInput>
    create: XOR<UserCreateWithoutUsedInvitesInput, UserUncheckedCreateWithoutUsedInvitesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUsedInvitesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUsedInvitesInput, UserUncheckedUpdateWithoutUsedInvitesInput>
  }

  export type UserUpdateWithoutUsedInvitesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isProfileComplete?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdInvites?: InviteUpdateManyWithoutCreatorNestedInput
  }

  export type UserUncheckedUpdateWithoutUsedInvitesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isProfileComplete?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdInvites?: InviteUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type InviteCreateManyCreatorInput = {
    id: string
    token: string
    createdAt: Date | string
    expiresAt: Date | string
    used?: boolean
    name: string
    usedBy?: string | null
    usedAt?: Date | string | null
  }

  export type InviteCreateManyUserInput = {
    id: string
    token: string
    createdBy: string
    createdAt: Date | string
    expiresAt: Date | string
    used?: boolean
    name: string
    usedAt?: Date | string | null
  }

  export type InviteUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    name?: StringFieldUpdateOperationsInput | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneWithoutUsedInvitesNestedInput
  }

  export type InviteUncheckedUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    name?: StringFieldUpdateOperationsInput | string
    usedBy?: NullableStringFieldUpdateOperationsInput | string | null
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type InviteUncheckedUpdateManyWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    name?: StringFieldUpdateOperationsInput | string
    usedBy?: NullableStringFieldUpdateOperationsInput | string | null
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type InviteUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    name?: StringFieldUpdateOperationsInput | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    creator?: UserUpdateOneWithoutCreatedInvitesNestedInput
  }

  export type InviteUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    name?: StringFieldUpdateOperationsInput | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type InviteUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    name?: StringFieldUpdateOperationsInput | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RoomCreateManyHotelInput = {
    id: string
    number: string
    name?: string | null
    type: $Enums.RoomType
    capacity: string
    maxCapacity: number
    beds?: JsonNullValueInput | InputJsonValue
    floor: $Enums.FloorType
    price?: Decimal | DecimalJsLike | number | string
    position?: JsonNullValueInput | InputJsonValue
    width?: number | null
    height?: number | null
    isCommon?: boolean
    zIndex?: number
    description?: string | null
    hasShower?: boolean
    hasToilet?: boolean
    pricePerPerson?: boolean
    textVertical?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StairsCreateManyHotelInput = {
    id: string
    floor: $Enums.FloorType
    position?: JsonNullValueInput | InputJsonValue
    width: number
    height: number
    direction: $Enums.StairsDirection
    targetFloor?: $Enums.FloorType | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoomUpdateWithoutHotelInput = {
    id?: StringFieldUpdateOperationsInput | string
    number?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumRoomTypeFieldUpdateOperationsInput | $Enums.RoomType
    capacity?: StringFieldUpdateOperationsInput | string
    maxCapacity?: IntFieldUpdateOperationsInput | number
    beds?: JsonNullValueInput | InputJsonValue
    floor?: EnumFloorTypeFieldUpdateOperationsInput | $Enums.FloorType
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    position?: JsonNullValueInput | InputJsonValue
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    isCommon?: BoolFieldUpdateOperationsInput | boolean
    zIndex?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    hasShower?: BoolFieldUpdateOperationsInput | boolean
    hasToilet?: BoolFieldUpdateOperationsInput | boolean
    pricePerPerson?: BoolFieldUpdateOperationsInput | boolean
    textVertical?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookings?: BookingUpdateManyWithoutRoomNestedInput
  }

  export type RoomUncheckedUpdateWithoutHotelInput = {
    id?: StringFieldUpdateOperationsInput | string
    number?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumRoomTypeFieldUpdateOperationsInput | $Enums.RoomType
    capacity?: StringFieldUpdateOperationsInput | string
    maxCapacity?: IntFieldUpdateOperationsInput | number
    beds?: JsonNullValueInput | InputJsonValue
    floor?: EnumFloorTypeFieldUpdateOperationsInput | $Enums.FloorType
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    position?: JsonNullValueInput | InputJsonValue
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    isCommon?: BoolFieldUpdateOperationsInput | boolean
    zIndex?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    hasShower?: BoolFieldUpdateOperationsInput | boolean
    hasToilet?: BoolFieldUpdateOperationsInput | boolean
    pricePerPerson?: BoolFieldUpdateOperationsInput | boolean
    textVertical?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookings?: BookingUncheckedUpdateManyWithoutRoomNestedInput
  }

  export type RoomUncheckedUpdateManyWithoutHotelInput = {
    id?: StringFieldUpdateOperationsInput | string
    number?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumRoomTypeFieldUpdateOperationsInput | $Enums.RoomType
    capacity?: StringFieldUpdateOperationsInput | string
    maxCapacity?: IntFieldUpdateOperationsInput | number
    beds?: JsonNullValueInput | InputJsonValue
    floor?: EnumFloorTypeFieldUpdateOperationsInput | $Enums.FloorType
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    position?: JsonNullValueInput | InputJsonValue
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    isCommon?: BoolFieldUpdateOperationsInput | boolean
    zIndex?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    hasShower?: BoolFieldUpdateOperationsInput | boolean
    hasToilet?: BoolFieldUpdateOperationsInput | boolean
    pricePerPerson?: BoolFieldUpdateOperationsInput | boolean
    textVertical?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StairsUpdateWithoutHotelInput = {
    id?: StringFieldUpdateOperationsInput | string
    floor?: EnumFloorTypeFieldUpdateOperationsInput | $Enums.FloorType
    position?: JsonNullValueInput | InputJsonValue
    width?: IntFieldUpdateOperationsInput | number
    height?: IntFieldUpdateOperationsInput | number
    direction?: EnumStairsDirectionFieldUpdateOperationsInput | $Enums.StairsDirection
    targetFloor?: NullableEnumFloorTypeFieldUpdateOperationsInput | $Enums.FloorType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StairsUncheckedUpdateWithoutHotelInput = {
    id?: StringFieldUpdateOperationsInput | string
    floor?: EnumFloorTypeFieldUpdateOperationsInput | $Enums.FloorType
    position?: JsonNullValueInput | InputJsonValue
    width?: IntFieldUpdateOperationsInput | number
    height?: IntFieldUpdateOperationsInput | number
    direction?: EnumStairsDirectionFieldUpdateOperationsInput | $Enums.StairsDirection
    targetFloor?: NullableEnumFloorTypeFieldUpdateOperationsInput | $Enums.FloorType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StairsUncheckedUpdateManyWithoutHotelInput = {
    id?: StringFieldUpdateOperationsInput | string
    floor?: EnumFloorTypeFieldUpdateOperationsInput | $Enums.FloorType
    position?: JsonNullValueInput | InputJsonValue
    width?: IntFieldUpdateOperationsInput | number
    height?: IntFieldUpdateOperationsInput | number
    direction?: EnumStairsDirectionFieldUpdateOperationsInput | $Enums.StairsDirection
    targetFloor?: NullableEnumFloorTypeFieldUpdateOperationsInput | $Enums.FloorType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingCreateManyRoomInput = {
    id: string
    bookedBy: string
    bookedDate: Date | string
    email?: string | null
    phone: string
    checkIn: Date | string
    checkOut: Date | string
    guests?: JsonNullValueInput | InputJsonValue
    notes?: string | null
    isConfirmed?: boolean
    confirmedBy?: string | null
    confirmedDate?: Date | string | null
    isPaid?: boolean
    paymentMethod?: $Enums.PaymentMethod | null
    paymentDate?: Date | string | null
    paidBy?: string | null
    amount?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookingUpdateWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookedBy?: StringFieldUpdateOperationsInput | string
    bookedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    checkIn?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOut?: DateTimeFieldUpdateOperationsInput | Date | string
    guests?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    isConfirmed?: BoolFieldUpdateOperationsInput | boolean
    confirmedBy?: NullableStringFieldUpdateOperationsInput | string | null
    confirmedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    paymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paidBy?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingUncheckedUpdateWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookedBy?: StringFieldUpdateOperationsInput | string
    bookedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    checkIn?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOut?: DateTimeFieldUpdateOperationsInput | Date | string
    guests?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    isConfirmed?: BoolFieldUpdateOperationsInput | boolean
    confirmedBy?: NullableStringFieldUpdateOperationsInput | string | null
    confirmedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    paymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paidBy?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingUncheckedUpdateManyWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookedBy?: StringFieldUpdateOperationsInput | string
    bookedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    checkIn?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOut?: DateTimeFieldUpdateOperationsInput | Date | string
    guests?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    isConfirmed?: BoolFieldUpdateOperationsInput | boolean
    confirmedBy?: NullableStringFieldUpdateOperationsInput | string | null
    confirmedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    paymentMethod?: NullableEnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod | null
    paymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paidBy?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}