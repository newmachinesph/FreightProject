import * as better_auth_client from 'better-auth/client';
import * as nanostores from 'nanostores';
import * as zod from 'zod';
import * as better_call from 'better-call';
import * as _better_fetch_fetch from '@better-fetch/fetch';
import * as better_auth from 'better-auth';
import * as better_auth_plugins from 'better-auth/plugins';

/**
 * @truckconnect/sdk — Client entry point
 *
 * Usage in any TruckConnect frontend app:
 *
 *   import { createTruckConnectClient } from "@truckconnect/sdk"
 *
 *   export const auth = createTruckConnectClient({
 *     baseURL: process.env.NEXT_PUBLIC_AUTH_URL ?? "https://auth.truckconnect.ph",
 *   })
 *
 *   // Then use exactly like Better Auth:
 *   const { data: session } = auth.useSession()
 *   await auth.signIn.email({ email, password })
 *   await auth.signOut()
 *   await auth.organization.create({ name, slug, metadata: { type: "enterprise_shipper" } })
 */
interface TruckConnectClientOptions {
    /** URL of the truckconnect-auth service. Defaults to http://localhost:3001 in dev. */
    baseURL?: string;
}
/**
 * Creates a fully-typed TruckConnect Auth client.
 * Call this once per app and export the result.
 */
declare function createTruckConnectClient(options?: TruckConnectClientOptions): {
    useActiveOrganization: () => {
        data: better_auth.Prettify<{
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            logo?: string | null | undefined | undefined;
            metadata?: any;
        } & {
            members: {
                id: string;
                organizationId: string;
                role: "admin" | "member" | "owner";
                createdAt: Date;
                userId: string;
                user: {
                    id: string;
                    email: string;
                    name: string;
                    image?: string | undefined;
                };
            }[];
            invitations: {
                id: string;
                organizationId: string;
                email: string;
                role: "admin" | "member" | "owner";
                status: better_auth_plugins.InvitationStatus;
                inviterId: string;
                expiresAt: Date;
                createdAt: Date;
            }[];
        }> | null;
        error: null | _better_fetch_fetch.BetterFetchError;
        isPending: boolean;
        isRefetching: boolean;
        refetch: (queryParams?: {
            query?: better_auth.SessionQueryParams;
        } | undefined) => Promise<void>;
    };
    useListOrganizations: () => {
        data: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            logo?: string | null | undefined | undefined;
            metadata?: any;
        }[] | null;
        error: null | _better_fetch_fetch.BetterFetchError;
        isPending: boolean;
        isRefetching: boolean;
        refetch: (queryParams?: {
            query?: better_auth.SessionQueryParams;
        } | undefined) => Promise<void>;
    };
    useActiveMember: () => {
        data: {
            id: string;
            organizationId: string;
            userId: string;
            role: string;
            createdAt: Date;
        } | null;
        error: null | _better_fetch_fetch.BetterFetchError;
        isPending: boolean;
        isRefetching: boolean;
        refetch: (queryParams?: {
            query?: better_auth.SessionQueryParams;
        } | undefined) => Promise<void>;
    };
    useActiveMemberRole: () => {
        data: {
            role: string;
        } | null;
        error: null | _better_fetch_fetch.BetterFetchError;
        isPending: boolean;
        isRefetching: boolean;
        refetch: (queryParams?: {
            query?: better_auth.SessionQueryParams;
        } | undefined) => Promise<void>;
    };
} & {
    admin: {
        setRole: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
            userId: string;
            role: "user" | "admin" | ("user" | "admin")[];
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            userId: string;
            role: "user" | "admin" | ("user" | "admin")[];
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            user: better_auth_plugins.UserWithRole;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    admin: {
        getUser: <FetchOptions extends better_auth.ClientFetchOption<never, Partial<{
            id: string;
        }> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            query: {
                id: string;
            };
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<better_auth_plugins.UserWithRole, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    admin: {
        createUser: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
            email: string;
            password?: string | undefined;
            name: string;
            role?: "user" | "admin" | ("user" | "admin")[] | undefined;
            data?: Record<string, any> | undefined;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            email: string;
            password?: string | undefined;
            name: string;
            role?: "user" | "admin" | ("user" | "admin")[] | undefined;
            data?: Record<string, any> | undefined;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            user: better_auth_plugins.UserWithRole;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    admin: {
        updateUser: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
            userId: unknown;
            data: Record<any, any>;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            userId: unknown;
            data: Record<any, any>;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<better_auth_plugins.UserWithRole, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    admin: {
        listUsers: <FetchOptions extends better_auth.ClientFetchOption<never, Partial<{
            searchValue?: string | undefined;
            searchField?: "email" | "name" | undefined;
            searchOperator?: "contains" | "starts_with" | "ends_with" | undefined;
            limit?: string | number | undefined;
            offset?: string | number | undefined;
            sortBy?: string | undefined;
            sortDirection?: "asc" | "desc" | undefined;
            filterField?: string | undefined;
            filterValue?: string | number | boolean | string[] | number[] | undefined;
            filterOperator?: "in" | "contains" | "starts_with" | "ends_with" | "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "not_in" | undefined;
        }> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            query: {
                searchValue?: string | undefined;
                searchField?: "email" | "name" | undefined;
                searchOperator?: "contains" | "starts_with" | "ends_with" | undefined;
                limit?: string | number | undefined;
                offset?: string | number | undefined;
                sortBy?: string | undefined;
                sortDirection?: "asc" | "desc" | undefined;
                filterField?: string | undefined;
                filterValue?: string | number | boolean | string[] | number[] | undefined;
                filterOperator?: "in" | "contains" | "starts_with" | "ends_with" | "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "not_in" | undefined;
            };
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            users: better_auth_plugins.UserWithRole[];
            total: number;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    admin: {
        listUserSessions: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
            userId: unknown;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            userId: unknown;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            sessions: better_auth_plugins.SessionWithImpersonatedBy[];
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    admin: {
        unbanUser: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
            userId: unknown;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            userId: unknown;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            user: better_auth_plugins.UserWithRole;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    admin: {
        banUser: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
            userId: unknown;
            banReason?: string | undefined;
            banExpiresIn?: number | undefined;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            userId: unknown;
            banReason?: string | undefined;
            banExpiresIn?: number | undefined;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            user: better_auth_plugins.UserWithRole;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    admin: {
        impersonateUser: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
            userId: unknown;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            userId: unknown;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            session: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                expiresAt: Date;
                token: string;
                ipAddress?: string | null | undefined;
                userAgent?: string | null | undefined;
            };
            user: better_auth_plugins.UserWithRole;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    admin: {
        stopImpersonating: <FetchOptions extends better_auth.ClientFetchOption<never, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0?: better_auth.Prettify<{
            query?: Record<string, any> | undefined;
            fetchOptions?: FetchOptions | undefined;
        }> | undefined, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            session: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                expiresAt: Date;
                token: string;
                ipAddress?: string | null | undefined;
                userAgent?: string | null | undefined;
            } & Record<string, any>;
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            } & Record<string, any>;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    admin: {
        revokeUserSession: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
            sessionToken: string;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            sessionToken: string;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            success: boolean;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    admin: {
        revokeUserSessions: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
            userId: unknown;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            userId: unknown;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            success: boolean;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    admin: {
        removeUser: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
            userId: unknown;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            userId: unknown;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            success: boolean;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    admin: {
        setUserPassword: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
            newPassword: string;
            userId: unknown;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            newPassword: string;
            userId: unknown;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            status: boolean;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    admin: {
        hasPermission: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
            permissions: {
                readonly user?: ("create" | "list" | "set-role" | "ban" | "impersonate" | "impersonate-admins" | "delete" | "set-password" | "get" | "update")[] | undefined;
                readonly session?: ("list" | "delete" | "revoke")[] | undefined;
            };
        } & {
            userId?: string | undefined;
            role?: "user" | "admin" | undefined;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            permissions: {
                readonly user?: ("create" | "list" | "set-role" | "ban" | "impersonate" | "impersonate-admins" | "delete" | "set-password" | "get" | "update")[] | undefined;
                readonly session?: ("list" | "delete" | "revoke")[] | undefined;
            };
        } & {
            userId?: string | undefined;
            role?: "user" | "admin" | undefined;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            error: null;
            success: boolean;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    organization: {
        create: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
            name: string;
            slug: string;
            userId?: string | undefined;
            logo?: string | undefined;
            metadata?: Record<string, any> | undefined;
            keepCurrentActiveOrganization?: boolean | undefined;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            name: string;
            slug: string;
            userId?: string | undefined;
            logo?: string | undefined;
            metadata?: Record<string, any> | undefined;
            keepCurrentActiveOrganization?: boolean | undefined;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<NonNullable<{
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            logo?: string | null | undefined | undefined;
            metadata?: any;
        } & {
            metadata: any;
            members: ({
                id: string;
                organizationId: string;
                userId: string;
                role: string;
                createdAt: Date;
            } | undefined)[];
        }>, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    organization: {
        update: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
            data: {
                name?: string | undefined;
                slug?: string | undefined;
                logo?: string | undefined;
                metadata?: Record<string, any> | undefined;
            } & Partial<{}>;
            organizationId?: string | undefined;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            data: {
                name?: string | undefined;
                slug?: string | undefined;
                logo?: string | undefined;
                metadata?: Record<string, any> | undefined;
            } & Partial<{}>;
            organizationId?: string | undefined;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            logo?: string | null | undefined | undefined;
            metadata?: any;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    organization: {
        delete: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
            organizationId: string;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            organizationId: string;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            logo?: string | null | undefined | undefined;
            metadata?: any;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    organization: {
        setActive: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
            organizationId?: string | null | undefined;
            organizationSlug?: string | undefined;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0?: better_auth.Prettify<{
            organizationId?: string | null | undefined;
            organizationSlug?: string | undefined;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }> | undefined, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            members: {
                id: string;
                organizationId: string;
                role: "admin" | "member" | "owner";
                createdAt: Date;
                userId: string;
                user: {
                    id: string;
                    email: string;
                    name: string;
                    image?: string | undefined;
                };
            }[];
            invitations: {
                id: string;
                organizationId: string;
                email: string;
                role: "admin" | "member" | "owner";
                status: better_auth_plugins.InvitationStatus;
                inviterId: string;
                expiresAt: Date;
                createdAt: Date;
            }[];
        } & {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            logo?: string | null | undefined | undefined;
            metadata?: any;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    organization: {
        getFullOrganization: <FetchOptions extends better_auth.ClientFetchOption<never, Partial<{
            organizationId?: string | undefined;
            organizationSlug?: string | undefined;
            membersLimit?: string | number | undefined;
        }> & Record<string, any>, Record<string, any> | undefined>>(data_0?: better_auth.Prettify<{
            query?: {
                organizationId?: string | undefined;
                organizationSlug?: string | undefined;
                membersLimit?: string | number | undefined;
            } | undefined;
            fetchOptions?: FetchOptions | undefined;
        }> | undefined, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            members: {
                id: string;
                organizationId: string;
                role: "admin" | "member" | "owner";
                createdAt: Date;
                userId: string;
                user: {
                    id: string;
                    email: string;
                    name: string;
                    image?: string | undefined;
                };
            }[];
            invitations: {
                id: string;
                organizationId: string;
                email: string;
                role: "admin" | "member" | "owner";
                status: better_auth_plugins.InvitationStatus;
                inviterId: string;
                expiresAt: Date;
                createdAt: Date;
            }[];
        } & {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            logo?: string | null | undefined | undefined;
            metadata?: any;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    organization: {
        list: <FetchOptions extends better_auth.ClientFetchOption<never, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0?: better_auth.Prettify<{
            query?: Record<string, any> | undefined;
            fetchOptions?: FetchOptions | undefined;
        }> | undefined, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            logo?: string | null | undefined | undefined;
            metadata?: any;
        }[], {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    organization: {
        inviteMember: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
            email: string;
            role: "admin" | "member" | "owner" | ("admin" | "member" | "owner")[];
            organizationId?: string | undefined;
            resend?: boolean | undefined;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            email: string;
            role: "admin" | "member" | "owner" | ("admin" | "member" | "owner")[];
            organizationId?: string | undefined;
            resend?: boolean | undefined;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<NonNullable<{
            id: string;
            organizationId: string;
            email: string;
            role: "admin" | "member" | "owner";
            status: better_auth_plugins.InvitationStatus;
            inviterId: string;
            expiresAt: Date;
            createdAt: Date;
        } | {
            id: string;
            organizationId: string;
            email: string;
            role: "admin" | "member" | "owner";
            status: better_auth_plugins.InvitationStatus;
            inviterId: string;
            expiresAt: Date;
            createdAt: Date;
        }>, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    organization: {
        cancelInvitation: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
            invitationId: string;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            invitationId: string;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            id: string;
            organizationId: string;
            email: string;
            role: "admin" | "member" | "owner";
            status: better_auth_plugins.InvitationStatus;
            inviterId: string;
            expiresAt: Date;
            createdAt: Date;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    organization: {
        acceptInvitation: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
            invitationId: string;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            invitationId: string;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            invitation: {
                id: string;
                organizationId: string;
                email: string;
                role: "admin" | "member" | "owner";
                status: better_auth_plugins.InvitationStatus;
                inviterId: string;
                expiresAt: Date;
                createdAt: Date;
            };
            member: {
                id: string;
                organizationId: string;
                userId: string;
                role: string;
                createdAt: Date;
            };
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    organization: {
        getInvitation: <FetchOptions extends better_auth.ClientFetchOption<never, Partial<{
            id: string;
        }> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            query: {
                id: string;
            };
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<NonNullable<{
            id: string;
            organizationId: string;
            email: string;
            role: "admin" | "member" | "owner";
            status: better_auth_plugins.InvitationStatus;
            inviterId: string;
            expiresAt: Date;
            createdAt: Date;
        } & {
            organizationName: string;
            organizationSlug: string;
            inviterEmail: string;
        }>, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    organization: {
        rejectInvitation: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
            invitationId: string;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            invitationId: string;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            invitation: {
                id: string;
                organizationId: string;
                email: string;
                role: "admin" | "member" | "owner";
                status: better_auth_plugins.InvitationStatus;
                inviterId: string;
                expiresAt: Date;
                createdAt: Date;
            } | null;
            member: null;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    organization: {
        listInvitations: <FetchOptions extends better_auth.ClientFetchOption<never, Partial<{
            organizationId?: string | undefined;
        }> & Record<string, any>, Record<string, any> | undefined>>(data_0?: better_auth.Prettify<{
            query?: {
                organizationId?: string | undefined;
            } | undefined;
            fetchOptions?: FetchOptions | undefined;
        }> | undefined, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            id: string;
            organizationId: string;
            email: string;
            role: "admin" | "member" | "owner";
            status: better_auth_plugins.InvitationStatus;
            inviterId: string;
            expiresAt: Date;
            createdAt: Date;
        }[], {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    organization: {
        getActiveMember: <FetchOptions extends better_auth.ClientFetchOption<never, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0?: better_auth.Prettify<{
            query?: Record<string, any> | undefined;
            fetchOptions?: FetchOptions | undefined;
        }> | undefined, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<NonNullable<Omit<{
            id: string;
            organizationId: string;
            role: "admin" | "member" | "owner";
            createdAt: Date;
            userId: string;
            user: {
                id: string;
                email: string;
                name: string;
                image?: string | undefined;
            };
        } & {
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            };
        }, "user"> & {
            user: {
                id: string;
                name: string;
                email: string;
                image: string | undefined;
            };
        }>, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    organization: {
        checkSlug: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
            slug: string;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            slug: string;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            status: boolean;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    organization: {
        removeMember: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
            memberIdOrEmail: string;
            organizationId?: string | undefined;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            memberIdOrEmail: string;
            organizationId?: string | undefined;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            member: {
                id: string;
                organizationId: string;
                role: "admin" | "member" | "owner";
                createdAt: Date;
                userId: string;
                user: {
                    id: string;
                    email: string;
                    name: string;
                    image?: string | undefined;
                };
            };
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    organization: {
        updateMemberRole: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
            role: better_auth.LiteralString | "admin" | better_auth.LiteralString[] | "member" | "owner" | ("admin" | "member" | "owner")[];
            memberId: string;
            organizationId?: string | undefined;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            role: better_auth.LiteralString | "admin" | better_auth.LiteralString[] | "member" | "owner" | ("admin" | "member" | "owner")[];
            memberId: string;
            organizationId?: string | undefined;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            id: string;
            organizationId: string;
            role: "admin" | "member" | "owner";
            createdAt: Date;
            userId: string;
            user: {
                id: string;
                email: string;
                name: string;
                image?: string | undefined;
            };
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    organization: {
        leave: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
            organizationId: string;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            organizationId: string;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<NonNullable<Omit<{
            id: string;
            organizationId: string;
            role: "admin" | "member" | "owner";
            createdAt: Date;
            userId: string;
            user: {
                id: string;
                email: string;
                name: string;
                image?: string | undefined;
            };
        } & {
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            };
        }, "user"> & {
            user: {
                id: string;
                name: string;
                email: string;
                image: string | undefined;
            };
        }>, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    organization: {
        listUserInvitations: <FetchOptions extends better_auth.ClientFetchOption<never, Partial<{
            email?: string | undefined;
        }> & Record<string, any>, Record<string, any> | undefined>>(data_0?: better_auth.Prettify<{
            query?: {
                email?: string | undefined;
            } | undefined;
            fetchOptions?: FetchOptions | undefined;
        }> | undefined, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<(Omit<{
            id: string;
            organizationId: string;
            email: string;
            role: "admin" | "member" | "owner";
            status: better_auth_plugins.InvitationStatus;
            inviterId: string;
            expiresAt: Date;
            createdAt: Date;
        } & {
            organization: {
                id: string;
                name: string;
                slug: string;
                createdAt: Date;
                logo?: string | null | undefined | undefined;
                metadata?: any;
            };
        }, "organization"> & {
            organizationName: string;
        })[], {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    organization: {
        listMembers: <FetchOptions extends better_auth.ClientFetchOption<never, Partial<{
            limit?: string | number | undefined;
            offset?: string | number | undefined;
            sortBy?: string | undefined;
            sortDirection?: "asc" | "desc" | undefined;
            filterField?: string | undefined;
            filterValue?: string | number | boolean | string[] | number[] | undefined;
            filterOperator?: "in" | "contains" | "starts_with" | "ends_with" | "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "not_in" | undefined;
            organizationId?: string | undefined;
            organizationSlug?: string | undefined;
        }> & Record<string, any>, Record<string, any> | undefined>>(data_0?: better_auth.Prettify<{
            query?: {
                limit?: string | number | undefined;
                offset?: string | number | undefined;
                sortBy?: string | undefined;
                sortDirection?: "asc" | "desc" | undefined;
                filterField?: string | undefined;
                filterValue?: string | number | boolean | string[] | number[] | undefined;
                filterOperator?: "in" | "contains" | "starts_with" | "ends_with" | "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "not_in" | undefined;
                organizationId?: string | undefined;
                organizationSlug?: string | undefined;
            } | undefined;
            fetchOptions?: FetchOptions | undefined;
        }> | undefined, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            members: ({
                id: string;
                organizationId: string;
                role: "admin" | "member" | "owner";
                createdAt: Date;
                userId: string;
                user: {
                    id: string;
                    email: string;
                    name: string;
                    image?: string | undefined;
                };
            } & {
                user: {
                    id: string;
                    name: string;
                    email: string;
                    image: string | null | undefined;
                };
            })[];
            total: number;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    organization: {
        getActiveMemberRole: <FetchOptions extends better_auth.ClientFetchOption<never, Partial<{
            userId?: string | undefined;
            organizationId?: string | undefined;
            organizationSlug?: string | undefined;
        }> & Record<string, any>, Record<string, any> | undefined>>(data_0?: better_auth.Prettify<{
            query?: {
                userId?: string | undefined;
                organizationId?: string | undefined;
                organizationSlug?: string | undefined;
            } | undefined;
            fetchOptions?: FetchOptions | undefined;
        }> | undefined, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            role: "admin" | "member" | "owner";
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    organization: {
        hasPermission: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
            permissions: {
                readonly organization?: ("delete" | "update")[] | undefined;
                readonly member?: ("create" | "delete" | "update")[] | undefined;
                readonly invitation?: ("cancel" | "create")[] | undefined;
                readonly team?: ("create" | "delete" | "update")[] | undefined;
                readonly ac?: ("create" | "delete" | "update" | "read")[] | undefined;
            };
        } & {
            organizationId?: string | undefined;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            permissions: {
                readonly organization?: ("delete" | "update")[] | undefined;
                readonly member?: ("create" | "delete" | "update")[] | undefined;
                readonly invitation?: ("cancel" | "create")[] | undefined;
                readonly team?: ("create" | "delete" | "update")[] | undefined;
                readonly ac?: ("create" | "delete" | "update" | "read")[] | undefined;
            };
        } & {
            organizationId?: string | undefined;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            error: null;
            success: boolean;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    signIn: {
        social: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
            provider: (string & {}) | "linear" | "huggingface" | "github" | "apple" | "atlassian" | "cognito" | "discord" | "facebook" | "figma" | "microsoft" | "google" | "slack" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "salesforce" | "vk" | "zoom" | "notion" | "kakao" | "naver" | "line" | "paybin" | "paypal" | "polar" | "railway" | "vercel";
            callbackURL?: string | undefined;
            newUserCallbackURL?: string | undefined;
            errorCallbackURL?: string | undefined;
            disableRedirect?: boolean | undefined;
            idToken?: {
                token: string;
                nonce?: string | undefined;
                accessToken?: string | undefined;
                refreshToken?: string | undefined;
                expiresAt?: number | undefined;
                user?: {
                    name?: {
                        firstName?: string | undefined;
                        lastName?: string | undefined;
                    } | undefined;
                    email?: string | undefined;
                } | undefined;
            } | undefined;
            scopes?: string[] | undefined;
            requestSignUp?: boolean | undefined;
            loginHint?: string | undefined;
            additionalData?: Record<string, any> | undefined;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            provider: (string & {}) | "linear" | "huggingface" | "github" | "apple" | "atlassian" | "cognito" | "discord" | "facebook" | "figma" | "microsoft" | "google" | "slack" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "salesforce" | "vk" | "zoom" | "notion" | "kakao" | "naver" | "line" | "paybin" | "paypal" | "polar" | "railway" | "vercel";
            callbackURL?: string | undefined;
            newUserCallbackURL?: string | undefined;
            errorCallbackURL?: string | undefined;
            disableRedirect?: boolean | undefined;
            idToken?: {
                token: string;
                nonce?: string | undefined;
                accessToken?: string | undefined;
                refreshToken?: string | undefined;
                expiresAt?: number | undefined;
                user?: {
                    name?: {
                        firstName?: string | undefined;
                        lastName?: string | undefined;
                    } | undefined;
                    email?: string | undefined;
                } | undefined;
            } | undefined;
            scopes?: string[] | undefined;
            requestSignUp?: boolean | undefined;
            loginHint?: string | undefined;
            additionalData?: Record<string, any> | undefined;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            redirect: boolean;
            url: string;
        } | (Omit<{
            redirect: boolean;
            token: string;
            url: undefined;
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined | undefined;
            };
        }, "user"> & {
            user: better_auth.StripEmptyObjects<{
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            } & {
                banned: boolean | null | undefined;
            } & {
                role?: string | null | undefined;
                banReason?: string | null | undefined;
                banExpires?: Date | null | undefined;
            }>;
        }), {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    signOut: <FetchOptions extends better_auth.ClientFetchOption<never, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0?: better_auth.Prettify<{
        query?: Record<string, any> | undefined;
        fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
        success: boolean;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    signUp: {
        email: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
            name: string;
            email: string;
            password: string;
            image?: string | undefined;
            callbackURL?: string | undefined;
            rememberMe?: boolean | undefined;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<better_auth_client.InferSignUpEmailCtx<{
            baseURL: string;
            fetchOptions: {
                credentials: RequestCredentials;
            };
            plugins: ({
                id: "admin-client";
                $InferServerPlugin: {
                    id: "admin";
                    init(): {
                        options: {
                            databaseHooks: {
                                user: {
                                    create: {
                                        before(user: {
                                            id: string;
                                            createdAt: Date;
                                            updatedAt: Date;
                                            email: string;
                                            emailVerified: boolean;
                                            name: string;
                                            image?: string | null | undefined;
                                        } & Record<string, unknown>): Promise<{
                                            data: {
                                                id: string;
                                                createdAt: Date;
                                                updatedAt: Date;
                                                email: string;
                                                emailVerified: boolean;
                                                name: string;
                                                image?: string | null | undefined;
                                                role: string;
                                            };
                                        }>;
                                    };
                                };
                                session: {
                                    create: {
                                        before(session: {
                                            id: string;
                                            createdAt: Date;
                                            updatedAt: Date;
                                            userId: string;
                                            expiresAt: Date;
                                            token: string;
                                            ipAddress?: string | null | undefined;
                                            userAgent?: string | null | undefined;
                                        } & Record<string, unknown>, ctx: better_auth.GenericEndpointContext | null): Promise<void>;
                                    };
                                };
                            };
                        };
                    };
                    hooks: {
                        after: {
                            matcher(context: better_auth.HookEndpointContext): boolean;
                            handler: (inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<better_auth_plugins.SessionWithImpersonatedBy[] | undefined>;
                        }[];
                    };
                    endpoints: {
                        setRole: better_call.StrictEndpoint<"/admin/set-role", {
                            method: "POST";
                            body: zod.ZodObject<{
                                userId: zod.ZodCoercedString<unknown>;
                                role: zod.ZodUnion<readonly [zod.ZodString, zod.ZodArray<zod.ZodString>]>;
                            }, better_auth.$strip>;
                            requireHeaders: true;
                            use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                                session: {
                                    user: better_auth_plugins.UserWithRole;
                                    session: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        userId: string;
                                        expiresAt: Date;
                                        token: string;
                                        ipAddress?: string | null | undefined;
                                        userAgent?: string | null | undefined;
                                    };
                                };
                            }>)[];
                            metadata: {
                                openapi: {
                                    operationId: string;
                                    summary: string;
                                    description: string;
                                    responses: {
                                        200: {
                                            description: string;
                                            content: {
                                                "application/json": {
                                                    schema: {
                                                        type: "object";
                                                        properties: {
                                                            user: {
                                                                $ref: string;
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                                $Infer: {
                                    body: {
                                        userId: string;
                                        role: "user" | "admin" | ("user" | "admin")[];
                                    };
                                };
                            };
                        }, {
                            user: better_auth_plugins.UserWithRole;
                        }>;
                        getUser: better_call.StrictEndpoint<"/admin/get-user", {
                            method: "GET";
                            query: zod.ZodObject<{
                                id: zod.ZodString;
                            }, better_auth.$strip>;
                            use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                                session: {
                                    user: better_auth_plugins.UserWithRole;
                                    session: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        userId: string;
                                        expiresAt: Date;
                                        token: string;
                                        ipAddress?: string | null | undefined;
                                        userAgent?: string | null | undefined;
                                    };
                                };
                            }>)[];
                            metadata: {
                                openapi: {
                                    operationId: string;
                                    summary: string;
                                    description: string;
                                    responses: {
                                        200: {
                                            description: string;
                                            content: {
                                                "application/json": {
                                                    schema: {
                                                        type: "object";
                                                        properties: {
                                                            user: {
                                                                $ref: string;
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        }, better_auth_plugins.UserWithRole>;
                        createUser: better_call.StrictEndpoint<"/admin/create-user", {
                            method: "POST";
                            body: zod.ZodObject<{
                                email: zod.ZodString;
                                password: zod.ZodOptional<zod.ZodString>;
                                name: zod.ZodString;
                                role: zod.ZodOptional<zod.ZodUnion<readonly [zod.ZodString, zod.ZodArray<zod.ZodString>]>>;
                                data: zod.ZodOptional<zod.ZodRecord<zod.ZodString, zod.ZodAny>>;
                            }, better_auth.$strip>;
                            metadata: {
                                openapi: {
                                    operationId: string;
                                    summary: string;
                                    description: string;
                                    responses: {
                                        200: {
                                            description: string;
                                            content: {
                                                "application/json": {
                                                    schema: {
                                                        type: "object";
                                                        properties: {
                                                            user: {
                                                                $ref: string;
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                                $Infer: {
                                    body: {
                                        email: string;
                                        password?: string | undefined;
                                        name: string;
                                        role?: "user" | "admin" | ("user" | "admin")[] | undefined;
                                        data?: Record<string, any> | undefined;
                                    };
                                };
                            };
                        }, {
                            user: better_auth_plugins.UserWithRole;
                        }>;
                        adminUpdateUser: better_call.StrictEndpoint<"/admin/update-user", {
                            method: "POST";
                            body: zod.ZodObject<{
                                userId: zod.ZodCoercedString<unknown>;
                                data: zod.ZodRecord<zod.ZodAny, zod.ZodAny>;
                            }, better_auth.$strip>;
                            use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                                session: {
                                    user: better_auth_plugins.UserWithRole;
                                    session: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        userId: string;
                                        expiresAt: Date;
                                        token: string;
                                        ipAddress?: string | null | undefined;
                                        userAgent?: string | null | undefined;
                                    };
                                };
                            }>)[];
                            metadata: {
                                openapi: {
                                    operationId: string;
                                    summary: string;
                                    description: string;
                                    responses: {
                                        200: {
                                            description: string;
                                            content: {
                                                "application/json": {
                                                    schema: {
                                                        type: "object";
                                                        properties: {
                                                            user: {
                                                                $ref: string;
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        }, better_auth_plugins.UserWithRole>;
                        listUsers: better_call.StrictEndpoint<"/admin/list-users", {
                            method: "GET";
                            use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                                session: {
                                    user: better_auth_plugins.UserWithRole;
                                    session: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        userId: string;
                                        expiresAt: Date;
                                        token: string;
                                        ipAddress?: string | null | undefined;
                                        userAgent?: string | null | undefined;
                                    };
                                };
                            }>)[];
                            query: zod.ZodObject<{
                                searchValue: zod.ZodOptional<zod.ZodString>;
                                searchField: zod.ZodOptional<zod.ZodEnum<{
                                    name: "name";
                                    email: "email";
                                }>>;
                                searchOperator: zod.ZodOptional<zod.ZodEnum<{
                                    contains: "contains";
                                    starts_with: "starts_with";
                                    ends_with: "ends_with";
                                }>>;
                                limit: zod.ZodOptional<zod.ZodUnion<[zod.ZodString, zod.ZodNumber]>>;
                                offset: zod.ZodOptional<zod.ZodUnion<[zod.ZodString, zod.ZodNumber]>>;
                                sortBy: zod.ZodOptional<zod.ZodString>;
                                sortDirection: zod.ZodOptional<zod.ZodEnum<{
                                    asc: "asc";
                                    desc: "desc";
                                }>>;
                                filterField: zod.ZodOptional<zod.ZodString>;
                                filterValue: zod.ZodOptional<zod.ZodUnion<[zod.ZodUnion<[zod.ZodUnion<[zod.ZodUnion<[zod.ZodString, zod.ZodNumber]>, zod.ZodBoolean]>, zod.ZodArray<zod.ZodString>]>, zod.ZodArray<zod.ZodNumber>]>>;
                                filterOperator: zod.ZodOptional<zod.ZodEnum<{
                                    eq: "eq";
                                    ne: "ne";
                                    gt: "gt";
                                    gte: "gte";
                                    lt: "lt";
                                    lte: "lte";
                                    in: "in";
                                    not_in: "not_in";
                                    contains: "contains";
                                    starts_with: "starts_with";
                                    ends_with: "ends_with";
                                }>>;
                            }, better_auth.$strip>;
                            metadata: {
                                openapi: {
                                    operationId: string;
                                    summary: string;
                                    description: string;
                                    responses: {
                                        200: {
                                            description: string;
                                            content: {
                                                "application/json": {
                                                    schema: {
                                                        type: "object";
                                                        properties: {
                                                            users: {
                                                                type: string;
                                                                items: {
                                                                    $ref: string;
                                                                };
                                                            };
                                                            total: {
                                                                type: string;
                                                            };
                                                            limit: {
                                                                type: string;
                                                            };
                                                            offset: {
                                                                type: string;
                                                            };
                                                        };
                                                        required: string[];
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        }, {
                            users: better_auth_plugins.UserWithRole[];
                            total: number;
                        }>;
                        listUserSessions: better_call.StrictEndpoint<"/admin/list-user-sessions", {
                            method: "POST";
                            use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                                session: {
                                    user: better_auth_plugins.UserWithRole;
                                    session: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        userId: string;
                                        expiresAt: Date;
                                        token: string;
                                        ipAddress?: string | null | undefined;
                                        userAgent?: string | null | undefined;
                                    };
                                };
                            }>)[];
                            body: zod.ZodObject<{
                                userId: zod.ZodCoercedString<unknown>;
                            }, better_auth.$strip>;
                            metadata: {
                                openapi: {
                                    operationId: string;
                                    summary: string;
                                    description: string;
                                    responses: {
                                        200: {
                                            description: string;
                                            content: {
                                                "application/json": {
                                                    schema: {
                                                        type: "object";
                                                        properties: {
                                                            sessions: {
                                                                type: string;
                                                                items: {
                                                                    $ref: string;
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        }, {
                            sessions: better_auth_plugins.SessionWithImpersonatedBy[];
                        }>;
                        unbanUser: better_call.StrictEndpoint<"/admin/unban-user", {
                            method: "POST";
                            body: zod.ZodObject<{
                                userId: zod.ZodCoercedString<unknown>;
                            }, better_auth.$strip>;
                            use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                                session: {
                                    user: better_auth_plugins.UserWithRole;
                                    session: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        userId: string;
                                        expiresAt: Date;
                                        token: string;
                                        ipAddress?: string | null | undefined;
                                        userAgent?: string | null | undefined;
                                    };
                                };
                            }>)[];
                            metadata: {
                                openapi: {
                                    operationId: string;
                                    summary: string;
                                    description: string;
                                    responses: {
                                        200: {
                                            description: string;
                                            content: {
                                                "application/json": {
                                                    schema: {
                                                        type: "object";
                                                        properties: {
                                                            user: {
                                                                $ref: string;
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        }, {
                            user: better_auth_plugins.UserWithRole;
                        }>;
                        banUser: better_call.StrictEndpoint<"/admin/ban-user", {
                            method: "POST";
                            body: zod.ZodObject<{
                                userId: zod.ZodCoercedString<unknown>;
                                banReason: zod.ZodOptional<zod.ZodString>;
                                banExpiresIn: zod.ZodOptional<zod.ZodNumber>;
                            }, better_auth.$strip>;
                            use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                                session: {
                                    user: better_auth_plugins.UserWithRole;
                                    session: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        userId: string;
                                        expiresAt: Date;
                                        token: string;
                                        ipAddress?: string | null | undefined;
                                        userAgent?: string | null | undefined;
                                    };
                                };
                            }>)[];
                            metadata: {
                                openapi: {
                                    operationId: string;
                                    summary: string;
                                    description: string;
                                    responses: {
                                        200: {
                                            description: string;
                                            content: {
                                                "application/json": {
                                                    schema: {
                                                        type: "object";
                                                        properties: {
                                                            user: {
                                                                $ref: string;
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        }, {
                            user: better_auth_plugins.UserWithRole;
                        }>;
                        impersonateUser: better_call.StrictEndpoint<"/admin/impersonate-user", {
                            method: "POST";
                            body: zod.ZodObject<{
                                userId: zod.ZodCoercedString<unknown>;
                            }, better_auth.$strip>;
                            use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                                session: {
                                    user: better_auth_plugins.UserWithRole;
                                    session: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        userId: string;
                                        expiresAt: Date;
                                        token: string;
                                        ipAddress?: string | null | undefined;
                                        userAgent?: string | null | undefined;
                                    };
                                };
                            }>)[];
                            metadata: {
                                openapi: {
                                    operationId: string;
                                    summary: string;
                                    description: string;
                                    responses: {
                                        200: {
                                            description: string;
                                            content: {
                                                "application/json": {
                                                    schema: {
                                                        type: "object";
                                                        properties: {
                                                            session: {
                                                                $ref: string;
                                                            };
                                                            user: {
                                                                $ref: string;
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        }, {
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                            user: better_auth_plugins.UserWithRole;
                        }>;
                        stopImpersonating: better_call.StrictEndpoint<"/admin/stop-impersonating", {
                            method: "POST";
                            requireHeaders: true;
                        }, {
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            } & Record<string, any>;
                            user: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                email: string;
                                emailVerified: boolean;
                                name: string;
                                image?: string | null | undefined;
                            } & Record<string, any>;
                        }>;
                        revokeUserSession: better_call.StrictEndpoint<"/admin/revoke-user-session", {
                            method: "POST";
                            body: zod.ZodObject<{
                                sessionToken: zod.ZodString;
                            }, better_auth.$strip>;
                            use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                                session: {
                                    user: better_auth_plugins.UserWithRole;
                                    session: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        userId: string;
                                        expiresAt: Date;
                                        token: string;
                                        ipAddress?: string | null | undefined;
                                        userAgent?: string | null | undefined;
                                    };
                                };
                            }>)[];
                            metadata: {
                                openapi: {
                                    operationId: string;
                                    summary: string;
                                    description: string;
                                    responses: {
                                        200: {
                                            description: string;
                                            content: {
                                                "application/json": {
                                                    schema: {
                                                        type: "object";
                                                        properties: {
                                                            success: {
                                                                type: string;
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        }, {
                            success: boolean;
                        }>;
                        revokeUserSessions: better_call.StrictEndpoint<"/admin/revoke-user-sessions", {
                            method: "POST";
                            body: zod.ZodObject<{
                                userId: zod.ZodCoercedString<unknown>;
                            }, better_auth.$strip>;
                            use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                                session: {
                                    user: better_auth_plugins.UserWithRole;
                                    session: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        userId: string;
                                        expiresAt: Date;
                                        token: string;
                                        ipAddress?: string | null | undefined;
                                        userAgent?: string | null | undefined;
                                    };
                                };
                            }>)[];
                            metadata: {
                                openapi: {
                                    operationId: string;
                                    summary: string;
                                    description: string;
                                    responses: {
                                        200: {
                                            description: string;
                                            content: {
                                                "application/json": {
                                                    schema: {
                                                        type: "object";
                                                        properties: {
                                                            success: {
                                                                type: string;
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        }, {
                            success: boolean;
                        }>;
                        removeUser: better_call.StrictEndpoint<"/admin/remove-user", {
                            method: "POST";
                            body: zod.ZodObject<{
                                userId: zod.ZodCoercedString<unknown>;
                            }, better_auth.$strip>;
                            use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                                session: {
                                    user: better_auth_plugins.UserWithRole;
                                    session: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        userId: string;
                                        expiresAt: Date;
                                        token: string;
                                        ipAddress?: string | null | undefined;
                                        userAgent?: string | null | undefined;
                                    };
                                };
                            }>)[];
                            metadata: {
                                openapi: {
                                    operationId: string;
                                    summary: string;
                                    description: string;
                                    responses: {
                                        200: {
                                            description: string;
                                            content: {
                                                "application/json": {
                                                    schema: {
                                                        type: "object";
                                                        properties: {
                                                            success: {
                                                                type: string;
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        }, {
                            success: boolean;
                        }>;
                        setUserPassword: better_call.StrictEndpoint<"/admin/set-user-password", {
                            method: "POST";
                            body: zod.ZodObject<{
                                newPassword: zod.ZodString;
                                userId: zod.ZodCoercedString<unknown>;
                            }, better_auth.$strip>;
                            use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                                session: {
                                    user: better_auth_plugins.UserWithRole;
                                    session: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        userId: string;
                                        expiresAt: Date;
                                        token: string;
                                        ipAddress?: string | null | undefined;
                                        userAgent?: string | null | undefined;
                                    };
                                };
                            }>)[];
                            metadata: {
                                openapi: {
                                    operationId: string;
                                    summary: string;
                                    description: string;
                                    responses: {
                                        200: {
                                            description: string;
                                            content: {
                                                "application/json": {
                                                    schema: {
                                                        type: "object";
                                                        properties: {
                                                            status: {
                                                                type: string;
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        }, {
                            status: boolean;
                        }>;
                        userHasPermission: better_call.StrictEndpoint<"/admin/has-permission", {
                            method: "POST";
                            body: zod.ZodIntersection<zod.ZodObject<{
                                userId: zod.ZodOptional<zod.ZodCoercedString<unknown>>;
                                role: zod.ZodOptional<zod.ZodString>;
                            }, better_auth.$strip>, zod.ZodUnion<readonly [zod.ZodObject<{
                                permission: zod.ZodRecord<zod.ZodString, zod.ZodArray<zod.ZodString>>;
                                permissions: zod.ZodUndefined;
                            }, better_auth.$strip>, zod.ZodObject<{
                                permission: zod.ZodUndefined;
                                permissions: zod.ZodRecord<zod.ZodString, zod.ZodArray<zod.ZodString>>;
                            }, better_auth.$strip>]>>;
                            metadata: {
                                openapi: {
                                    description: string;
                                    requestBody: {
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        permissions: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                    };
                                                    required: string[];
                                                };
                                            };
                                        };
                                    };
                                    responses: {
                                        "200": {
                                            description: string;
                                            content: {
                                                "application/json": {
                                                    schema: {
                                                        type: "object";
                                                        properties: {
                                                            error: {
                                                                type: string;
                                                            };
                                                            success: {
                                                                type: string;
                                                            };
                                                        };
                                                        required: string[];
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                                $Infer: {
                                    body: {
                                        permissions: {
                                            readonly user?: ("create" | "list" | "set-role" | "ban" | "impersonate" | "impersonate-admins" | "delete" | "set-password" | "get" | "update")[] | undefined;
                                            readonly session?: ("list" | "delete" | "revoke")[] | undefined;
                                        };
                                    } & {
                                        userId?: string | undefined;
                                        role?: "user" | "admin" | undefined;
                                    };
                                };
                            };
                        }, {
                            error: null;
                            success: boolean;
                        }>;
                    };
                    $ERROR_CODES: {
                        USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: better_auth.RawError<"USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL">;
                        FAILED_TO_CREATE_USER: better_auth.RawError<"FAILED_TO_CREATE_USER">;
                        USER_ALREADY_EXISTS: better_auth.RawError<"USER_ALREADY_EXISTS">;
                        YOU_CANNOT_BAN_YOURSELF: better_auth.RawError<"YOU_CANNOT_BAN_YOURSELF">;
                        YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE">;
                        YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS">;
                        YOU_ARE_NOT_ALLOWED_TO_LIST_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_LIST_USERS">;
                        YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS">;
                        YOU_ARE_NOT_ALLOWED_TO_BAN_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_BAN_USERS">;
                        YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS">;
                        YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS">;
                        YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS">;
                        YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD">;
                        BANNED_USER: better_auth.RawError<"BANNED_USER">;
                        YOU_ARE_NOT_ALLOWED_TO_GET_USER: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_GET_USER">;
                        NO_DATA_TO_UPDATE: better_auth.RawError<"NO_DATA_TO_UPDATE">;
                        YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS">;
                        YOU_CANNOT_REMOVE_YOURSELF: better_auth.RawError<"YOU_CANNOT_REMOVE_YOURSELF">;
                        YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE">;
                        YOU_CANNOT_IMPERSONATE_ADMINS: better_auth.RawError<"YOU_CANNOT_IMPERSONATE_ADMINS">;
                        INVALID_ROLE_TYPE: better_auth.RawError<"INVALID_ROLE_TYPE">;
                    };
                    schema: {
                        user: {
                            fields: {
                                role: {
                                    type: "string";
                                    required: false;
                                    input: false;
                                };
                                banned: {
                                    type: "boolean";
                                    defaultValue: false;
                                    required: false;
                                    input: false;
                                };
                                banReason: {
                                    type: "string";
                                    required: false;
                                    input: false;
                                };
                                banExpires: {
                                    type: "date";
                                    required: false;
                                    input: false;
                                };
                            };
                        };
                        session: {
                            fields: {
                                impersonatedBy: {
                                    type: "string";
                                    required: false;
                                };
                            };
                        };
                    };
                    options: NoInfer<{
                        ac: better_auth_plugins.AccessControl<{
                            readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "impersonate-admins", "delete", "set-password", "get", "update"];
                            readonly session: readonly ["list", "revoke", "delete"];
                        }>;
                        roles: {
                            admin: better_auth_plugins.Role;
                            user: better_auth_plugins.Role;
                        };
                    }>;
                };
                getActions: () => {
                    admin: {
                        checkRolePermission: <R extends "user" | "admin">(data: {
                            permissions: {
                                readonly user?: ("create" | "list" | "set-role" | "ban" | "impersonate" | "impersonate-admins" | "delete" | "set-password" | "get" | "update")[] | undefined;
                                readonly session?: ("list" | "delete" | "revoke")[] | undefined;
                            };
                        } & {
                            role: R;
                        }) => boolean;
                    };
                };
                pathMethods: {
                    "/admin/list-users": "GET";
                    "/admin/stop-impersonating": "POST";
                };
                $ERROR_CODES: {
                    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: better_auth.RawError<"USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL">;
                    FAILED_TO_CREATE_USER: better_auth.RawError<"FAILED_TO_CREATE_USER">;
                    USER_ALREADY_EXISTS: better_auth.RawError<"USER_ALREADY_EXISTS">;
                    YOU_CANNOT_BAN_YOURSELF: better_auth.RawError<"YOU_CANNOT_BAN_YOURSELF">;
                    YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE">;
                    YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS">;
                    YOU_ARE_NOT_ALLOWED_TO_LIST_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_LIST_USERS">;
                    YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS">;
                    YOU_ARE_NOT_ALLOWED_TO_BAN_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_BAN_USERS">;
                    YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS">;
                    YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS">;
                    YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS">;
                    YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD">;
                    BANNED_USER: better_auth.RawError<"BANNED_USER">;
                    YOU_ARE_NOT_ALLOWED_TO_GET_USER: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_GET_USER">;
                    NO_DATA_TO_UPDATE: better_auth.RawError<"NO_DATA_TO_UPDATE">;
                    YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS">;
                    YOU_CANNOT_REMOVE_YOURSELF: better_auth.RawError<"YOU_CANNOT_REMOVE_YOURSELF">;
                    YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE">;
                    YOU_CANNOT_IMPERSONATE_ADMINS: better_auth.RawError<"YOU_CANNOT_IMPERSONATE_ADMINS">;
                    INVALID_ROLE_TYPE: better_auth.RawError<"INVALID_ROLE_TYPE">;
                };
            } | {
                id: "organization";
                $InferServerPlugin: better_auth_plugins.OrganizationPlugin<{
                    ac: better_auth_plugins.AccessControl<{
                        readonly organization: readonly ["update", "delete"];
                        readonly member: readonly ["create", "update", "delete"];
                        readonly invitation: readonly ["create", "cancel"];
                        readonly team: readonly ["create", "update", "delete"];
                        readonly ac: readonly ["create", "read", "update", "delete"];
                    }>;
                    roles: {
                        admin: better_auth_plugins.Role;
                        member: better_auth_plugins.Role;
                        owner: better_auth_plugins.Role;
                    };
                    teams: {
                        enabled: false;
                    };
                    schema: {
                        organization?: {
                            additionalFields?: {
                                [key: string]: better_auth.DBFieldAttribute;
                            };
                        };
                        member?: {
                            additionalFields?: {
                                [key: string]: better_auth.DBFieldAttribute;
                            };
                        };
                        invitation?: {
                            additionalFields?: {
                                [key: string]: better_auth.DBFieldAttribute;
                            };
                        };
                        team?: {
                            additionalFields?: {
                                [key: string]: better_auth.DBFieldAttribute;
                            };
                        };
                        organizationRole?: {
                            additionalFields?: {
                                [key: string]: better_auth.DBFieldAttribute;
                            };
                        };
                    } | undefined;
                    dynamicAccessControl: {
                        enabled: false;
                    };
                }>;
                getActions: ($fetch: _better_fetch_fetch.BetterFetch, _$store: better_auth.ClientStore, co: better_auth.BetterAuthClientOptions | undefined) => {
                    $Infer: {
                        ActiveOrganization: {
                            members: {
                                id: string;
                                organizationId: string;
                                role: "admin" | "member" | "owner";
                                createdAt: Date;
                                userId: string;
                                user: {
                                    id: string;
                                    email: string;
                                    name: string;
                                    image?: string | undefined;
                                };
                            }[];
                            invitations: {
                                id: string;
                                organizationId: string;
                                email: string;
                                role: "admin" | "member" | "owner";
                                status: better_auth_plugins.InvitationStatus;
                                inviterId: string;
                                expiresAt: Date;
                                createdAt: Date;
                            }[];
                        } & {
                            id: string;
                            name: string;
                            slug: string;
                            createdAt: Date;
                            logo?: string | null | undefined | undefined;
                            metadata?: any;
                        };
                        Organization: {
                            id: string;
                            name: string;
                            slug: string;
                            createdAt: Date;
                            logo?: string | null | undefined;
                            metadata?: any;
                        };
                        Invitation: {
                            id: string;
                            organizationId: string;
                            email: string;
                            role: "admin" | "member" | "owner";
                            status: better_auth_plugins.InvitationStatus;
                            inviterId: string;
                            expiresAt: Date;
                            createdAt: Date;
                        };
                        Member: {
                            id: string;
                            organizationId: string;
                            role: "admin" | "member" | "owner";
                            createdAt: Date;
                            userId: string;
                            user: {
                                id: string;
                                email: string;
                                name: string;
                                image?: string | undefined;
                            };
                        };
                        Team: {
                            id: string;
                            name: string;
                            organizationId: string;
                            createdAt: Date;
                            updatedAt?: Date | undefined;
                        };
                    };
                    organization: {
                        checkRolePermission: <R extends "admin" | "member" | "owner">(data: {
                            permissions: {
                                readonly organization?: ("delete" | "update")[] | undefined;
                                readonly member?: ("create" | "delete" | "update")[] | undefined;
                                readonly invitation?: ("cancel" | "create")[] | undefined;
                                readonly team?: ("create" | "delete" | "update")[] | undefined;
                                readonly ac?: ("create" | "delete" | "update" | "read")[] | undefined;
                            };
                        } & {
                            role: R;
                        }) => boolean;
                    };
                };
                getAtoms: ($fetch: _better_fetch_fetch.BetterFetch) => {
                    $listOrg: nanostores.PreinitializedWritableAtom<boolean> & object;
                    $activeOrgSignal: nanostores.PreinitializedWritableAtom<boolean> & object;
                    $activeMemberSignal: nanostores.PreinitializedWritableAtom<boolean> & object;
                    $activeMemberRoleSignal: nanostores.PreinitializedWritableAtom<boolean> & object;
                    activeOrganization: better_auth_client.AuthQueryAtom<better_auth.Prettify<{
                        id: string;
                        name: string;
                        slug: string;
                        createdAt: Date;
                        logo?: string | null | undefined | undefined;
                        metadata?: any;
                    } & {
                        members: {
                            id: string;
                            organizationId: string;
                            role: "admin" | "member" | "owner";
                            createdAt: Date;
                            userId: string;
                            user: {
                                id: string;
                                email: string;
                                name: string;
                                image?: string | undefined;
                            };
                        }[];
                        invitations: {
                            id: string;
                            organizationId: string;
                            email: string;
                            role: "admin" | "member" | "owner";
                            status: better_auth_plugins.InvitationStatus;
                            inviterId: string;
                            expiresAt: Date;
                            createdAt: Date;
                        }[];
                    }>>;
                    listOrganizations: better_auth_client.AuthQueryAtom<{
                        id: string;
                        name: string;
                        slug: string;
                        createdAt: Date;
                        logo?: string | null | undefined | undefined;
                        metadata?: any;
                    }[]>;
                    activeMember: better_auth_client.AuthQueryAtom<{
                        id: string;
                        organizationId: string;
                        userId: string;
                        role: string;
                        createdAt: Date;
                    }>;
                    activeMemberRole: better_auth_client.AuthQueryAtom<{
                        role: string;
                    }>;
                };
                pathMethods: {
                    "/organization/get-full-organization": "GET";
                    "/organization/list-user-teams": "GET";
                };
                atomListeners: ({
                    matcher(path: string): path is "/organization/create" | "/organization/update" | "/organization/delete";
                    signal: "$listOrg";
                } | {
                    matcher(path: string): boolean;
                    signal: "$activeOrgSignal";
                } | {
                    matcher(path: string): boolean;
                    signal: "$sessionSignal";
                } | {
                    matcher(path: string): boolean;
                    signal: "$activeMemberSignal";
                } | {
                    matcher(path: string): boolean;
                    signal: "$activeMemberRoleSignal";
                })[];
                $ERROR_CODES: {
                    YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION">;
                    YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS: better_auth.RawError<"YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS">;
                    ORGANIZATION_ALREADY_EXISTS: better_auth.RawError<"ORGANIZATION_ALREADY_EXISTS">;
                    ORGANIZATION_SLUG_ALREADY_TAKEN: better_auth.RawError<"ORGANIZATION_SLUG_ALREADY_TAKEN">;
                    ORGANIZATION_NOT_FOUND: better_auth.RawError<"ORGANIZATION_NOT_FOUND">;
                    USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION: better_auth.RawError<"USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION">;
                    YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_ORGANIZATION: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_ORGANIZATION">;
                    YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_ORGANIZATION: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_ORGANIZATION">;
                    NO_ACTIVE_ORGANIZATION: better_auth.RawError<"NO_ACTIVE_ORGANIZATION">;
                    USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION: better_auth.RawError<"USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION">;
                    MEMBER_NOT_FOUND: better_auth.RawError<"MEMBER_NOT_FOUND">;
                    ROLE_NOT_FOUND: better_auth.RawError<"ROLE_NOT_FOUND">;
                    YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM">;
                    TEAM_ALREADY_EXISTS: better_auth.RawError<"TEAM_ALREADY_EXISTS">;
                    TEAM_NOT_FOUND: better_auth.RawError<"TEAM_NOT_FOUND">;
                    YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER: better_auth.RawError<"YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER">;
                    YOU_CANNOT_LEAVE_THE_ORGANIZATION_WITHOUT_AN_OWNER: better_auth.RawError<"YOU_CANNOT_LEAVE_THE_ORGANIZATION_WITHOUT_AN_OWNER">;
                    YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_MEMBER: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_MEMBER">;
                    YOU_ARE_NOT_ALLOWED_TO_INVITE_USERS_TO_THIS_ORGANIZATION: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_INVITE_USERS_TO_THIS_ORGANIZATION">;
                    USER_IS_ALREADY_INVITED_TO_THIS_ORGANIZATION: better_auth.RawError<"USER_IS_ALREADY_INVITED_TO_THIS_ORGANIZATION">;
                    INVITATION_NOT_FOUND: better_auth.RawError<"INVITATION_NOT_FOUND">;
                    YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION: better_auth.RawError<"YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION">;
                    EMAIL_VERIFICATION_REQUIRED_BEFORE_ACCEPTING_OR_REJECTING_INVITATION: better_auth.RawError<"EMAIL_VERIFICATION_REQUIRED_BEFORE_ACCEPTING_OR_REJECTING_INVITATION">;
                    YOU_ARE_NOT_ALLOWED_TO_CANCEL_THIS_INVITATION: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_CANCEL_THIS_INVITATION">;
                    INVITER_IS_NO_LONGER_A_MEMBER_OF_THE_ORGANIZATION: better_auth.RawError<"INVITER_IS_NO_LONGER_A_MEMBER_OF_THE_ORGANIZATION">;
                    YOU_ARE_NOT_ALLOWED_TO_INVITE_USER_WITH_THIS_ROLE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_INVITE_USER_WITH_THIS_ROLE">;
                    FAILED_TO_RETRIEVE_INVITATION: better_auth.RawError<"FAILED_TO_RETRIEVE_INVITATION">;
                    YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_TEAMS: better_auth.RawError<"YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_TEAMS">;
                    UNABLE_TO_REMOVE_LAST_TEAM: better_auth.RawError<"UNABLE_TO_REMOVE_LAST_TEAM">;
                    YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_MEMBER: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_MEMBER">;
                    ORGANIZATION_MEMBERSHIP_LIMIT_REACHED: better_auth.RawError<"ORGANIZATION_MEMBERSHIP_LIMIT_REACHED">;
                    YOU_ARE_NOT_ALLOWED_TO_CREATE_TEAMS_IN_THIS_ORGANIZATION: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_TEAMS_IN_THIS_ORGANIZATION">;
                    YOU_ARE_NOT_ALLOWED_TO_DELETE_TEAMS_IN_THIS_ORGANIZATION: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_TEAMS_IN_THIS_ORGANIZATION">;
                    YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_TEAM: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_TEAM">;
                    YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_TEAM: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_TEAM">;
                    INVITATION_LIMIT_REACHED: better_auth.RawError<"INVITATION_LIMIT_REACHED">;
                    TEAM_MEMBER_LIMIT_REACHED: better_auth.RawError<"TEAM_MEMBER_LIMIT_REACHED">;
                    USER_IS_NOT_A_MEMBER_OF_THE_TEAM: better_auth.RawError<"USER_IS_NOT_A_MEMBER_OF_THE_TEAM">;
                    YOU_CAN_NOT_ACCESS_THE_MEMBERS_OF_THIS_TEAM: better_auth.RawError<"YOU_CAN_NOT_ACCESS_THE_MEMBERS_OF_THIS_TEAM">;
                    YOU_DO_NOT_HAVE_AN_ACTIVE_TEAM: better_auth.RawError<"YOU_DO_NOT_HAVE_AN_ACTIVE_TEAM">;
                    YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM_MEMBER: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM_MEMBER">;
                    YOU_ARE_NOT_ALLOWED_TO_REMOVE_A_TEAM_MEMBER: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_REMOVE_A_TEAM_MEMBER">;
                    YOU_ARE_NOT_ALLOWED_TO_ACCESS_THIS_ORGANIZATION: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_ACCESS_THIS_ORGANIZATION">;
                    YOU_ARE_NOT_A_MEMBER_OF_THIS_ORGANIZATION: better_auth.RawError<"YOU_ARE_NOT_A_MEMBER_OF_THIS_ORGANIZATION">;
                    MISSING_AC_INSTANCE: better_auth.RawError<"MISSING_AC_INSTANCE">;
                    YOU_MUST_BE_IN_AN_ORGANIZATION_TO_CREATE_A_ROLE: better_auth.RawError<"YOU_MUST_BE_IN_AN_ORGANIZATION_TO_CREATE_A_ROLE">;
                    YOU_ARE_NOT_ALLOWED_TO_CREATE_A_ROLE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_A_ROLE">;
                    YOU_ARE_NOT_ALLOWED_TO_UPDATE_A_ROLE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_UPDATE_A_ROLE">;
                    YOU_ARE_NOT_ALLOWED_TO_DELETE_A_ROLE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_A_ROLE">;
                    YOU_ARE_NOT_ALLOWED_TO_READ_A_ROLE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_READ_A_ROLE">;
                    YOU_ARE_NOT_ALLOWED_TO_LIST_A_ROLE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_LIST_A_ROLE">;
                    YOU_ARE_NOT_ALLOWED_TO_GET_A_ROLE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_GET_A_ROLE">;
                    TOO_MANY_ROLES: better_auth.RawError<"TOO_MANY_ROLES">;
                    INVALID_RESOURCE: better_auth.RawError<"INVALID_RESOURCE">;
                    ROLE_NAME_IS_ALREADY_TAKEN: better_auth.RawError<"ROLE_NAME_IS_ALREADY_TAKEN">;
                    CANNOT_DELETE_A_PRE_DEFINED_ROLE: better_auth.RawError<"CANNOT_DELETE_A_PRE_DEFINED_ROLE">;
                    ROLE_IS_ASSIGNED_TO_MEMBERS: better_auth.RawError<"ROLE_IS_ASSIGNED_TO_MEMBERS">;
                };
            })[];
        }, FetchOptions>>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<(Omit<{
            token: null;
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined | undefined;
            };
        }, "user"> & {
            user: better_auth.StripEmptyObjects<{
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            } & {
                banned: boolean | null | undefined;
            } & {
                role?: string | null | undefined;
                banReason?: string | null | undefined;
                banExpires?: Date | null | undefined;
            }>;
        }) | (Omit<{
            token: string;
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined | undefined;
            };
        }, "user"> & {
            user: better_auth.StripEmptyObjects<{
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            } & {
                banned: boolean | null | undefined;
            } & {
                role?: string | null | undefined;
                banReason?: string | null | undefined;
                banExpires?: Date | null | undefined;
            }>;
        }), {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    signIn: {
        email: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
            email: string;
            password: string;
            callbackURL?: string | undefined;
            rememberMe?: boolean | undefined;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            email: string;
            password: string;
            callbackURL?: string | undefined;
            rememberMe?: boolean | undefined;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<Omit<{
            redirect: boolean;
            token: string;
            url?: string | undefined;
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined | undefined;
            };
        }, "user"> & {
            user: better_auth.StripEmptyObjects<{
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            } & {
                banned: boolean | null | undefined;
            } & {
                role?: string | null | undefined;
                banReason?: string | null | undefined;
                banExpires?: Date | null | undefined;
            }>;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    resetPassword: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
        newPassword: string;
        token?: string | undefined;
    }> & Record<string, any>, Partial<{
        token?: string | undefined;
    }> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
        newPassword: string;
        token?: string | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
        status: boolean;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    verifyEmail: <FetchOptions extends better_auth.ClientFetchOption<never, Partial<{
        token: string;
        callbackURL?: string | undefined;
    }> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
        query: {
            token: string;
            callbackURL?: string | undefined;
        };
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<NonNullable<void | {
        status: boolean;
    }>, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    sendVerificationEmail: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
        email: string;
        callbackURL?: string | undefined;
    }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
        email: string;
        callbackURL?: string | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
        status: boolean;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    changeEmail: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
        newEmail: string;
        callbackURL?: string | undefined;
    }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
        newEmail: string;
        callbackURL?: string | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
        status: boolean;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    changePassword: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
        newPassword: string;
        currentPassword: string;
        revokeOtherSessions?: boolean | undefined;
    }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
        newPassword: string;
        currentPassword: string;
        revokeOtherSessions?: boolean | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<Omit<{
        token: string | null;
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined;
        } & Record<string, any> & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined;
        };
    }, "user"> & {
        user: better_auth.StripEmptyObjects<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined;
        } & {
            banned: boolean | null | undefined;
        } & {
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        }>;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    updateSession: <FetchOptions extends better_auth.ClientFetchOption<Partial<Partial<{}>> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0?: better_auth.Prettify<Partial<{}> & {
        fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
        session: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            expiresAt: Date;
            token: string;
            ipAddress?: string | null | undefined;
            userAgent?: string | null | undefined;
        };
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    updateUser: <FetchOptions extends better_auth.ClientFetchOption<Partial<Partial<{}> & {
        name?: string | undefined;
        image?: string | undefined | null;
    }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0?: better_auth.Prettify<better_auth_client.InferUserUpdateCtx<{
        baseURL: string;
        fetchOptions: {
            credentials: RequestCredentials;
        };
        plugins: ({
            id: "admin-client";
            $InferServerPlugin: {
                id: "admin";
                init(): {
                    options: {
                        databaseHooks: {
                            user: {
                                create: {
                                    before(user: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        email: string;
                                        emailVerified: boolean;
                                        name: string;
                                        image?: string | null | undefined;
                                    } & Record<string, unknown>): Promise<{
                                        data: {
                                            id: string;
                                            createdAt: Date;
                                            updatedAt: Date;
                                            email: string;
                                            emailVerified: boolean;
                                            name: string;
                                            image?: string | null | undefined;
                                            role: string;
                                        };
                                    }>;
                                };
                            };
                            session: {
                                create: {
                                    before(session: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        userId: string;
                                        expiresAt: Date;
                                        token: string;
                                        ipAddress?: string | null | undefined;
                                        userAgent?: string | null | undefined;
                                    } & Record<string, unknown>, ctx: better_auth.GenericEndpointContext | null): Promise<void>;
                                };
                            };
                        };
                    };
                };
                hooks: {
                    after: {
                        matcher(context: better_auth.HookEndpointContext): boolean;
                        handler: (inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<better_auth_plugins.SessionWithImpersonatedBy[] | undefined>;
                    }[];
                };
                endpoints: {
                    setRole: better_call.StrictEndpoint<"/admin/set-role", {
                        method: "POST";
                        body: zod.ZodObject<{
                            userId: zod.ZodCoercedString<unknown>;
                            role: zod.ZodUnion<readonly [zod.ZodString, zod.ZodArray<zod.ZodString>]>;
                        }, better_auth.$strip>;
                        requireHeaders: true;
                        use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                            session: {
                                user: better_auth_plugins.UserWithRole;
                                session: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                            };
                        }>)[];
                        metadata: {
                            openapi: {
                                operationId: string;
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        user: {
                                                            $ref: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                            $Infer: {
                                body: {
                                    userId: string;
                                    role: "user" | "admin" | ("user" | "admin")[];
                                };
                            };
                        };
                    }, {
                        user: better_auth_plugins.UserWithRole;
                    }>;
                    getUser: better_call.StrictEndpoint<"/admin/get-user", {
                        method: "GET";
                        query: zod.ZodObject<{
                            id: zod.ZodString;
                        }, better_auth.$strip>;
                        use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                            session: {
                                user: better_auth_plugins.UserWithRole;
                                session: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                            };
                        }>)[];
                        metadata: {
                            openapi: {
                                operationId: string;
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        user: {
                                                            $ref: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    }, better_auth_plugins.UserWithRole>;
                    createUser: better_call.StrictEndpoint<"/admin/create-user", {
                        method: "POST";
                        body: zod.ZodObject<{
                            email: zod.ZodString;
                            password: zod.ZodOptional<zod.ZodString>;
                            name: zod.ZodString;
                            role: zod.ZodOptional<zod.ZodUnion<readonly [zod.ZodString, zod.ZodArray<zod.ZodString>]>>;
                            data: zod.ZodOptional<zod.ZodRecord<zod.ZodString, zod.ZodAny>>;
                        }, better_auth.$strip>;
                        metadata: {
                            openapi: {
                                operationId: string;
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        user: {
                                                            $ref: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                            $Infer: {
                                body: {
                                    email: string;
                                    password?: string | undefined;
                                    name: string;
                                    role?: "user" | "admin" | ("user" | "admin")[] | undefined;
                                    data?: Record<string, any> | undefined;
                                };
                            };
                        };
                    }, {
                        user: better_auth_plugins.UserWithRole;
                    }>;
                    adminUpdateUser: better_call.StrictEndpoint<"/admin/update-user", {
                        method: "POST";
                        body: zod.ZodObject<{
                            userId: zod.ZodCoercedString<unknown>;
                            data: zod.ZodRecord<zod.ZodAny, zod.ZodAny>;
                        }, better_auth.$strip>;
                        use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                            session: {
                                user: better_auth_plugins.UserWithRole;
                                session: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                            };
                        }>)[];
                        metadata: {
                            openapi: {
                                operationId: string;
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        user: {
                                                            $ref: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    }, better_auth_plugins.UserWithRole>;
                    listUsers: better_call.StrictEndpoint<"/admin/list-users", {
                        method: "GET";
                        use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                            session: {
                                user: better_auth_plugins.UserWithRole;
                                session: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                            };
                        }>)[];
                        query: zod.ZodObject<{
                            searchValue: zod.ZodOptional<zod.ZodString>;
                            searchField: zod.ZodOptional<zod.ZodEnum<{
                                name: "name";
                                email: "email";
                            }>>;
                            searchOperator: zod.ZodOptional<zod.ZodEnum<{
                                contains: "contains";
                                starts_with: "starts_with";
                                ends_with: "ends_with";
                            }>>;
                            limit: zod.ZodOptional<zod.ZodUnion<[zod.ZodString, zod.ZodNumber]>>;
                            offset: zod.ZodOptional<zod.ZodUnion<[zod.ZodString, zod.ZodNumber]>>;
                            sortBy: zod.ZodOptional<zod.ZodString>;
                            sortDirection: zod.ZodOptional<zod.ZodEnum<{
                                asc: "asc";
                                desc: "desc";
                            }>>;
                            filterField: zod.ZodOptional<zod.ZodString>;
                            filterValue: zod.ZodOptional<zod.ZodUnion<[zod.ZodUnion<[zod.ZodUnion<[zod.ZodUnion<[zod.ZodString, zod.ZodNumber]>, zod.ZodBoolean]>, zod.ZodArray<zod.ZodString>]>, zod.ZodArray<zod.ZodNumber>]>>;
                            filterOperator: zod.ZodOptional<zod.ZodEnum<{
                                eq: "eq";
                                ne: "ne";
                                gt: "gt";
                                gte: "gte";
                                lt: "lt";
                                lte: "lte";
                                in: "in";
                                not_in: "not_in";
                                contains: "contains";
                                starts_with: "starts_with";
                                ends_with: "ends_with";
                            }>>;
                        }, better_auth.$strip>;
                        metadata: {
                            openapi: {
                                operationId: string;
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        users: {
                                                            type: string;
                                                            items: {
                                                                $ref: string;
                                                            };
                                                        };
                                                        total: {
                                                            type: string;
                                                        };
                                                        limit: {
                                                            type: string;
                                                        };
                                                        offset: {
                                                            type: string;
                                                        };
                                                    };
                                                    required: string[];
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    }, {
                        users: better_auth_plugins.UserWithRole[];
                        total: number;
                    }>;
                    listUserSessions: better_call.StrictEndpoint<"/admin/list-user-sessions", {
                        method: "POST";
                        use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                            session: {
                                user: better_auth_plugins.UserWithRole;
                                session: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                            };
                        }>)[];
                        body: zod.ZodObject<{
                            userId: zod.ZodCoercedString<unknown>;
                        }, better_auth.$strip>;
                        metadata: {
                            openapi: {
                                operationId: string;
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        sessions: {
                                                            type: string;
                                                            items: {
                                                                $ref: string;
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    }, {
                        sessions: better_auth_plugins.SessionWithImpersonatedBy[];
                    }>;
                    unbanUser: better_call.StrictEndpoint<"/admin/unban-user", {
                        method: "POST";
                        body: zod.ZodObject<{
                            userId: zod.ZodCoercedString<unknown>;
                        }, better_auth.$strip>;
                        use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                            session: {
                                user: better_auth_plugins.UserWithRole;
                                session: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                            };
                        }>)[];
                        metadata: {
                            openapi: {
                                operationId: string;
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        user: {
                                                            $ref: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    }, {
                        user: better_auth_plugins.UserWithRole;
                    }>;
                    banUser: better_call.StrictEndpoint<"/admin/ban-user", {
                        method: "POST";
                        body: zod.ZodObject<{
                            userId: zod.ZodCoercedString<unknown>;
                            banReason: zod.ZodOptional<zod.ZodString>;
                            banExpiresIn: zod.ZodOptional<zod.ZodNumber>;
                        }, better_auth.$strip>;
                        use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                            session: {
                                user: better_auth_plugins.UserWithRole;
                                session: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                            };
                        }>)[];
                        metadata: {
                            openapi: {
                                operationId: string;
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        user: {
                                                            $ref: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    }, {
                        user: better_auth_plugins.UserWithRole;
                    }>;
                    impersonateUser: better_call.StrictEndpoint<"/admin/impersonate-user", {
                        method: "POST";
                        body: zod.ZodObject<{
                            userId: zod.ZodCoercedString<unknown>;
                        }, better_auth.$strip>;
                        use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                            session: {
                                user: better_auth_plugins.UserWithRole;
                                session: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                            };
                        }>)[];
                        metadata: {
                            openapi: {
                                operationId: string;
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        session: {
                                                            $ref: string;
                                                        };
                                                        user: {
                                                            $ref: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    }, {
                        session: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: better_auth_plugins.UserWithRole;
                    }>;
                    stopImpersonating: better_call.StrictEndpoint<"/admin/stop-impersonating", {
                        method: "POST";
                        requireHeaders: true;
                    }, {
                        session: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        } & Record<string, any>;
                        user: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            image?: string | null | undefined;
                        } & Record<string, any>;
                    }>;
                    revokeUserSession: better_call.StrictEndpoint<"/admin/revoke-user-session", {
                        method: "POST";
                        body: zod.ZodObject<{
                            sessionToken: zod.ZodString;
                        }, better_auth.$strip>;
                        use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                            session: {
                                user: better_auth_plugins.UserWithRole;
                                session: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                            };
                        }>)[];
                        metadata: {
                            openapi: {
                                operationId: string;
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        success: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    }, {
                        success: boolean;
                    }>;
                    revokeUserSessions: better_call.StrictEndpoint<"/admin/revoke-user-sessions", {
                        method: "POST";
                        body: zod.ZodObject<{
                            userId: zod.ZodCoercedString<unknown>;
                        }, better_auth.$strip>;
                        use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                            session: {
                                user: better_auth_plugins.UserWithRole;
                                session: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                            };
                        }>)[];
                        metadata: {
                            openapi: {
                                operationId: string;
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        success: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    }, {
                        success: boolean;
                    }>;
                    removeUser: better_call.StrictEndpoint<"/admin/remove-user", {
                        method: "POST";
                        body: zod.ZodObject<{
                            userId: zod.ZodCoercedString<unknown>;
                        }, better_auth.$strip>;
                        use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                            session: {
                                user: better_auth_plugins.UserWithRole;
                                session: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                            };
                        }>)[];
                        metadata: {
                            openapi: {
                                operationId: string;
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        success: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    }, {
                        success: boolean;
                    }>;
                    setUserPassword: better_call.StrictEndpoint<"/admin/set-user-password", {
                        method: "POST";
                        body: zod.ZodObject<{
                            newPassword: zod.ZodString;
                            userId: zod.ZodCoercedString<unknown>;
                        }, better_auth.$strip>;
                        use: ((inputContext: better_call.MiddlewareInputContext<better_call.MiddlewareOptions>) => Promise<{
                            session: {
                                user: better_auth_plugins.UserWithRole;
                                session: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                            };
                        }>)[];
                        metadata: {
                            openapi: {
                                operationId: string;
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        status: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    }, {
                        status: boolean;
                    }>;
                    userHasPermission: better_call.StrictEndpoint<"/admin/has-permission", {
                        method: "POST";
                        body: zod.ZodIntersection<zod.ZodObject<{
                            userId: zod.ZodOptional<zod.ZodCoercedString<unknown>>;
                            role: zod.ZodOptional<zod.ZodString>;
                        }, better_auth.$strip>, zod.ZodUnion<readonly [zod.ZodObject<{
                            permission: zod.ZodRecord<zod.ZodString, zod.ZodArray<zod.ZodString>>;
                            permissions: zod.ZodUndefined;
                        }, better_auth.$strip>, zod.ZodObject<{
                            permission: zod.ZodUndefined;
                            permissions: zod.ZodRecord<zod.ZodString, zod.ZodArray<zod.ZodString>>;
                        }, better_auth.$strip>]>>;
                        metadata: {
                            openapi: {
                                description: string;
                                requestBody: {
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    permissions: {
                                                        type: string;
                                                        description: string;
                                                    };
                                                };
                                                required: string[];
                                            };
                                        };
                                    };
                                };
                                responses: {
                                    "200": {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        error: {
                                                            type: string;
                                                        };
                                                        success: {
                                                            type: string;
                                                        };
                                                    };
                                                    required: string[];
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                            $Infer: {
                                body: {
                                    permissions: {
                                        readonly user?: ("create" | "list" | "set-role" | "ban" | "impersonate" | "impersonate-admins" | "delete" | "set-password" | "get" | "update")[] | undefined;
                                        readonly session?: ("list" | "delete" | "revoke")[] | undefined;
                                    };
                                } & {
                                    userId?: string | undefined;
                                    role?: "user" | "admin" | undefined;
                                };
                            };
                        };
                    }, {
                        error: null;
                        success: boolean;
                    }>;
                };
                $ERROR_CODES: {
                    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: better_auth.RawError<"USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL">;
                    FAILED_TO_CREATE_USER: better_auth.RawError<"FAILED_TO_CREATE_USER">;
                    USER_ALREADY_EXISTS: better_auth.RawError<"USER_ALREADY_EXISTS">;
                    YOU_CANNOT_BAN_YOURSELF: better_auth.RawError<"YOU_CANNOT_BAN_YOURSELF">;
                    YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE">;
                    YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS">;
                    YOU_ARE_NOT_ALLOWED_TO_LIST_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_LIST_USERS">;
                    YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS">;
                    YOU_ARE_NOT_ALLOWED_TO_BAN_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_BAN_USERS">;
                    YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS">;
                    YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS">;
                    YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS">;
                    YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD">;
                    BANNED_USER: better_auth.RawError<"BANNED_USER">;
                    YOU_ARE_NOT_ALLOWED_TO_GET_USER: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_GET_USER">;
                    NO_DATA_TO_UPDATE: better_auth.RawError<"NO_DATA_TO_UPDATE">;
                    YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS">;
                    YOU_CANNOT_REMOVE_YOURSELF: better_auth.RawError<"YOU_CANNOT_REMOVE_YOURSELF">;
                    YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE">;
                    YOU_CANNOT_IMPERSONATE_ADMINS: better_auth.RawError<"YOU_CANNOT_IMPERSONATE_ADMINS">;
                    INVALID_ROLE_TYPE: better_auth.RawError<"INVALID_ROLE_TYPE">;
                };
                schema: {
                    user: {
                        fields: {
                            role: {
                                type: "string";
                                required: false;
                                input: false;
                            };
                            banned: {
                                type: "boolean";
                                defaultValue: false;
                                required: false;
                                input: false;
                            };
                            banReason: {
                                type: "string";
                                required: false;
                                input: false;
                            };
                            banExpires: {
                                type: "date";
                                required: false;
                                input: false;
                            };
                        };
                    };
                    session: {
                        fields: {
                            impersonatedBy: {
                                type: "string";
                                required: false;
                            };
                        };
                    };
                };
                options: NoInfer<{
                    ac: better_auth_plugins.AccessControl<{
                        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "impersonate-admins", "delete", "set-password", "get", "update"];
                        readonly session: readonly ["list", "revoke", "delete"];
                    }>;
                    roles: {
                        admin: better_auth_plugins.Role;
                        user: better_auth_plugins.Role;
                    };
                }>;
            };
            getActions: () => {
                admin: {
                    checkRolePermission: <R extends "user" | "admin">(data: {
                        permissions: {
                            readonly user?: ("create" | "list" | "set-role" | "ban" | "impersonate" | "impersonate-admins" | "delete" | "set-password" | "get" | "update")[] | undefined;
                            readonly session?: ("list" | "delete" | "revoke")[] | undefined;
                        };
                    } & {
                        role: R;
                    }) => boolean;
                };
            };
            pathMethods: {
                "/admin/list-users": "GET";
                "/admin/stop-impersonating": "POST";
            };
            $ERROR_CODES: {
                USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: better_auth.RawError<"USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL">;
                FAILED_TO_CREATE_USER: better_auth.RawError<"FAILED_TO_CREATE_USER">;
                USER_ALREADY_EXISTS: better_auth.RawError<"USER_ALREADY_EXISTS">;
                YOU_CANNOT_BAN_YOURSELF: better_auth.RawError<"YOU_CANNOT_BAN_YOURSELF">;
                YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE">;
                YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS">;
                YOU_ARE_NOT_ALLOWED_TO_LIST_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_LIST_USERS">;
                YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS">;
                YOU_ARE_NOT_ALLOWED_TO_BAN_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_BAN_USERS">;
                YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS">;
                YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS">;
                YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS">;
                YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD">;
                BANNED_USER: better_auth.RawError<"BANNED_USER">;
                YOU_ARE_NOT_ALLOWED_TO_GET_USER: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_GET_USER">;
                NO_DATA_TO_UPDATE: better_auth.RawError<"NO_DATA_TO_UPDATE">;
                YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS">;
                YOU_CANNOT_REMOVE_YOURSELF: better_auth.RawError<"YOU_CANNOT_REMOVE_YOURSELF">;
                YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE">;
                YOU_CANNOT_IMPERSONATE_ADMINS: better_auth.RawError<"YOU_CANNOT_IMPERSONATE_ADMINS">;
                INVALID_ROLE_TYPE: better_auth.RawError<"INVALID_ROLE_TYPE">;
            };
        } | {
            id: "organization";
            $InferServerPlugin: better_auth_plugins.OrganizationPlugin<{
                ac: better_auth_plugins.AccessControl<{
                    readonly organization: readonly ["update", "delete"];
                    readonly member: readonly ["create", "update", "delete"];
                    readonly invitation: readonly ["create", "cancel"];
                    readonly team: readonly ["create", "update", "delete"];
                    readonly ac: readonly ["create", "read", "update", "delete"];
                }>;
                roles: {
                    admin: better_auth_plugins.Role;
                    member: better_auth_plugins.Role;
                    owner: better_auth_plugins.Role;
                };
                teams: {
                    enabled: false;
                };
                schema: {
                    organization?: {
                        additionalFields?: {
                            [key: string]: better_auth.DBFieldAttribute;
                        };
                    };
                    member?: {
                        additionalFields?: {
                            [key: string]: better_auth.DBFieldAttribute;
                        };
                    };
                    invitation?: {
                        additionalFields?: {
                            [key: string]: better_auth.DBFieldAttribute;
                        };
                    };
                    team?: {
                        additionalFields?: {
                            [key: string]: better_auth.DBFieldAttribute;
                        };
                    };
                    organizationRole?: {
                        additionalFields?: {
                            [key: string]: better_auth.DBFieldAttribute;
                        };
                    };
                } | undefined;
                dynamicAccessControl: {
                    enabled: false;
                };
            }>;
            getActions: ($fetch: _better_fetch_fetch.BetterFetch, _$store: better_auth.ClientStore, co: better_auth.BetterAuthClientOptions | undefined) => {
                $Infer: {
                    ActiveOrganization: {
                        members: {
                            id: string;
                            organizationId: string;
                            role: "admin" | "member" | "owner";
                            createdAt: Date;
                            userId: string;
                            user: {
                                id: string;
                                email: string;
                                name: string;
                                image?: string | undefined;
                            };
                        }[];
                        invitations: {
                            id: string;
                            organizationId: string;
                            email: string;
                            role: "admin" | "member" | "owner";
                            status: better_auth_plugins.InvitationStatus;
                            inviterId: string;
                            expiresAt: Date;
                            createdAt: Date;
                        }[];
                    } & {
                        id: string;
                        name: string;
                        slug: string;
                        createdAt: Date;
                        logo?: string | null | undefined | undefined;
                        metadata?: any;
                    };
                    Organization: {
                        id: string;
                        name: string;
                        slug: string;
                        createdAt: Date;
                        logo?: string | null | undefined;
                        metadata?: any;
                    };
                    Invitation: {
                        id: string;
                        organizationId: string;
                        email: string;
                        role: "admin" | "member" | "owner";
                        status: better_auth_plugins.InvitationStatus;
                        inviterId: string;
                        expiresAt: Date;
                        createdAt: Date;
                    };
                    Member: {
                        id: string;
                        organizationId: string;
                        role: "admin" | "member" | "owner";
                        createdAt: Date;
                        userId: string;
                        user: {
                            id: string;
                            email: string;
                            name: string;
                            image?: string | undefined;
                        };
                    };
                    Team: {
                        id: string;
                        name: string;
                        organizationId: string;
                        createdAt: Date;
                        updatedAt?: Date | undefined;
                    };
                };
                organization: {
                    checkRolePermission: <R extends "admin" | "member" | "owner">(data: {
                        permissions: {
                            readonly organization?: ("delete" | "update")[] | undefined;
                            readonly member?: ("create" | "delete" | "update")[] | undefined;
                            readonly invitation?: ("cancel" | "create")[] | undefined;
                            readonly team?: ("create" | "delete" | "update")[] | undefined;
                            readonly ac?: ("create" | "delete" | "update" | "read")[] | undefined;
                        };
                    } & {
                        role: R;
                    }) => boolean;
                };
            };
            getAtoms: ($fetch: _better_fetch_fetch.BetterFetch) => {
                $listOrg: nanostores.PreinitializedWritableAtom<boolean> & object;
                $activeOrgSignal: nanostores.PreinitializedWritableAtom<boolean> & object;
                $activeMemberSignal: nanostores.PreinitializedWritableAtom<boolean> & object;
                $activeMemberRoleSignal: nanostores.PreinitializedWritableAtom<boolean> & object;
                activeOrganization: better_auth_client.AuthQueryAtom<better_auth.Prettify<{
                    id: string;
                    name: string;
                    slug: string;
                    createdAt: Date;
                    logo?: string | null | undefined | undefined;
                    metadata?: any;
                } & {
                    members: {
                        id: string;
                        organizationId: string;
                        role: "admin" | "member" | "owner";
                        createdAt: Date;
                        userId: string;
                        user: {
                            id: string;
                            email: string;
                            name: string;
                            image?: string | undefined;
                        };
                    }[];
                    invitations: {
                        id: string;
                        organizationId: string;
                        email: string;
                        role: "admin" | "member" | "owner";
                        status: better_auth_plugins.InvitationStatus;
                        inviterId: string;
                        expiresAt: Date;
                        createdAt: Date;
                    }[];
                }>>;
                listOrganizations: better_auth_client.AuthQueryAtom<{
                    id: string;
                    name: string;
                    slug: string;
                    createdAt: Date;
                    logo?: string | null | undefined | undefined;
                    metadata?: any;
                }[]>;
                activeMember: better_auth_client.AuthQueryAtom<{
                    id: string;
                    organizationId: string;
                    userId: string;
                    role: string;
                    createdAt: Date;
                }>;
                activeMemberRole: better_auth_client.AuthQueryAtom<{
                    role: string;
                }>;
            };
            pathMethods: {
                "/organization/get-full-organization": "GET";
                "/organization/list-user-teams": "GET";
            };
            atomListeners: ({
                matcher(path: string): path is "/organization/create" | "/organization/update" | "/organization/delete";
                signal: "$listOrg";
            } | {
                matcher(path: string): boolean;
                signal: "$activeOrgSignal";
            } | {
                matcher(path: string): boolean;
                signal: "$sessionSignal";
            } | {
                matcher(path: string): boolean;
                signal: "$activeMemberSignal";
            } | {
                matcher(path: string): boolean;
                signal: "$activeMemberRoleSignal";
            })[];
            $ERROR_CODES: {
                YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION">;
                YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS: better_auth.RawError<"YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS">;
                ORGANIZATION_ALREADY_EXISTS: better_auth.RawError<"ORGANIZATION_ALREADY_EXISTS">;
                ORGANIZATION_SLUG_ALREADY_TAKEN: better_auth.RawError<"ORGANIZATION_SLUG_ALREADY_TAKEN">;
                ORGANIZATION_NOT_FOUND: better_auth.RawError<"ORGANIZATION_NOT_FOUND">;
                USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION: better_auth.RawError<"USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION">;
                YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_ORGANIZATION: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_ORGANIZATION">;
                YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_ORGANIZATION: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_ORGANIZATION">;
                NO_ACTIVE_ORGANIZATION: better_auth.RawError<"NO_ACTIVE_ORGANIZATION">;
                USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION: better_auth.RawError<"USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION">;
                MEMBER_NOT_FOUND: better_auth.RawError<"MEMBER_NOT_FOUND">;
                ROLE_NOT_FOUND: better_auth.RawError<"ROLE_NOT_FOUND">;
                YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM">;
                TEAM_ALREADY_EXISTS: better_auth.RawError<"TEAM_ALREADY_EXISTS">;
                TEAM_NOT_FOUND: better_auth.RawError<"TEAM_NOT_FOUND">;
                YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER: better_auth.RawError<"YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER">;
                YOU_CANNOT_LEAVE_THE_ORGANIZATION_WITHOUT_AN_OWNER: better_auth.RawError<"YOU_CANNOT_LEAVE_THE_ORGANIZATION_WITHOUT_AN_OWNER">;
                YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_MEMBER: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_MEMBER">;
                YOU_ARE_NOT_ALLOWED_TO_INVITE_USERS_TO_THIS_ORGANIZATION: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_INVITE_USERS_TO_THIS_ORGANIZATION">;
                USER_IS_ALREADY_INVITED_TO_THIS_ORGANIZATION: better_auth.RawError<"USER_IS_ALREADY_INVITED_TO_THIS_ORGANIZATION">;
                INVITATION_NOT_FOUND: better_auth.RawError<"INVITATION_NOT_FOUND">;
                YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION: better_auth.RawError<"YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION">;
                EMAIL_VERIFICATION_REQUIRED_BEFORE_ACCEPTING_OR_REJECTING_INVITATION: better_auth.RawError<"EMAIL_VERIFICATION_REQUIRED_BEFORE_ACCEPTING_OR_REJECTING_INVITATION">;
                YOU_ARE_NOT_ALLOWED_TO_CANCEL_THIS_INVITATION: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_CANCEL_THIS_INVITATION">;
                INVITER_IS_NO_LONGER_A_MEMBER_OF_THE_ORGANIZATION: better_auth.RawError<"INVITER_IS_NO_LONGER_A_MEMBER_OF_THE_ORGANIZATION">;
                YOU_ARE_NOT_ALLOWED_TO_INVITE_USER_WITH_THIS_ROLE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_INVITE_USER_WITH_THIS_ROLE">;
                FAILED_TO_RETRIEVE_INVITATION: better_auth.RawError<"FAILED_TO_RETRIEVE_INVITATION">;
                YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_TEAMS: better_auth.RawError<"YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_TEAMS">;
                UNABLE_TO_REMOVE_LAST_TEAM: better_auth.RawError<"UNABLE_TO_REMOVE_LAST_TEAM">;
                YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_MEMBER: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_MEMBER">;
                ORGANIZATION_MEMBERSHIP_LIMIT_REACHED: better_auth.RawError<"ORGANIZATION_MEMBERSHIP_LIMIT_REACHED">;
                YOU_ARE_NOT_ALLOWED_TO_CREATE_TEAMS_IN_THIS_ORGANIZATION: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_TEAMS_IN_THIS_ORGANIZATION">;
                YOU_ARE_NOT_ALLOWED_TO_DELETE_TEAMS_IN_THIS_ORGANIZATION: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_TEAMS_IN_THIS_ORGANIZATION">;
                YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_TEAM: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_TEAM">;
                YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_TEAM: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_TEAM">;
                INVITATION_LIMIT_REACHED: better_auth.RawError<"INVITATION_LIMIT_REACHED">;
                TEAM_MEMBER_LIMIT_REACHED: better_auth.RawError<"TEAM_MEMBER_LIMIT_REACHED">;
                USER_IS_NOT_A_MEMBER_OF_THE_TEAM: better_auth.RawError<"USER_IS_NOT_A_MEMBER_OF_THE_TEAM">;
                YOU_CAN_NOT_ACCESS_THE_MEMBERS_OF_THIS_TEAM: better_auth.RawError<"YOU_CAN_NOT_ACCESS_THE_MEMBERS_OF_THIS_TEAM">;
                YOU_DO_NOT_HAVE_AN_ACTIVE_TEAM: better_auth.RawError<"YOU_DO_NOT_HAVE_AN_ACTIVE_TEAM">;
                YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM_MEMBER: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM_MEMBER">;
                YOU_ARE_NOT_ALLOWED_TO_REMOVE_A_TEAM_MEMBER: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_REMOVE_A_TEAM_MEMBER">;
                YOU_ARE_NOT_ALLOWED_TO_ACCESS_THIS_ORGANIZATION: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_ACCESS_THIS_ORGANIZATION">;
                YOU_ARE_NOT_A_MEMBER_OF_THIS_ORGANIZATION: better_auth.RawError<"YOU_ARE_NOT_A_MEMBER_OF_THIS_ORGANIZATION">;
                MISSING_AC_INSTANCE: better_auth.RawError<"MISSING_AC_INSTANCE">;
                YOU_MUST_BE_IN_AN_ORGANIZATION_TO_CREATE_A_ROLE: better_auth.RawError<"YOU_MUST_BE_IN_AN_ORGANIZATION_TO_CREATE_A_ROLE">;
                YOU_ARE_NOT_ALLOWED_TO_CREATE_A_ROLE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_A_ROLE">;
                YOU_ARE_NOT_ALLOWED_TO_UPDATE_A_ROLE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_UPDATE_A_ROLE">;
                YOU_ARE_NOT_ALLOWED_TO_DELETE_A_ROLE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_A_ROLE">;
                YOU_ARE_NOT_ALLOWED_TO_READ_A_ROLE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_READ_A_ROLE">;
                YOU_ARE_NOT_ALLOWED_TO_LIST_A_ROLE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_LIST_A_ROLE">;
                YOU_ARE_NOT_ALLOWED_TO_GET_A_ROLE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_GET_A_ROLE">;
                TOO_MANY_ROLES: better_auth.RawError<"TOO_MANY_ROLES">;
                INVALID_RESOURCE: better_auth.RawError<"INVALID_RESOURCE">;
                ROLE_NAME_IS_ALREADY_TAKEN: better_auth.RawError<"ROLE_NAME_IS_ALREADY_TAKEN">;
                CANNOT_DELETE_A_PRE_DEFINED_ROLE: better_auth.RawError<"CANNOT_DELETE_A_PRE_DEFINED_ROLE">;
                ROLE_IS_ASSIGNED_TO_MEMBERS: better_auth.RawError<"ROLE_IS_ASSIGNED_TO_MEMBERS">;
            };
        })[];
    }, FetchOptions>> | undefined, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
        status: boolean;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    deleteUser: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
        callbackURL?: string | undefined;
        password?: string | undefined;
        token?: string | undefined;
    }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0?: better_auth.Prettify<{
        callbackURL?: string | undefined;
        password?: string | undefined;
        token?: string | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
        success: boolean;
        message: string;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    requestPasswordReset: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
        email: string;
        redirectTo?: string | undefined;
    }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
        email: string;
        redirectTo?: string | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
        status: boolean;
        message: string;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    resetPassword: {
        ":token": <FetchOptions extends better_auth.ClientFetchOption<never, Partial<{
            callbackURL: string;
        }> & Record<string, any>, {
            token: string;
        }>>(data_0: better_auth.Prettify<{
            query: {
                callbackURL: string;
            };
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<never, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    listSessions: <FetchOptions extends better_auth.ClientFetchOption<never, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0?: better_auth.Prettify<{
        query?: Record<string, any> | undefined;
        fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<better_auth.Prettify<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined | undefined;
        userAgent?: string | null | undefined | undefined;
    }>[], {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    revokeSession: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
        token: string;
    }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
        token: string;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
        status: boolean;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    revokeSessions: <FetchOptions extends better_auth.ClientFetchOption<never, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0?: better_auth.Prettify<{
        query?: Record<string, any> | undefined;
        fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
        status: boolean;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    revokeOtherSessions: <FetchOptions extends better_auth.ClientFetchOption<never, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0?: better_auth.Prettify<{
        query?: Record<string, any> | undefined;
        fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
        status: boolean;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    linkSocial: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
        provider: unknown;
        callbackURL?: string | undefined;
        idToken?: {
            token: string;
            nonce?: string | undefined;
            accessToken?: string | undefined;
            refreshToken?: string | undefined;
            scopes?: string[] | undefined;
        } | undefined;
        requestSignUp?: boolean | undefined;
        scopes?: string[] | undefined;
        errorCallbackURL?: string | undefined;
        disableRedirect?: boolean | undefined;
        additionalData?: Record<string, any> | undefined;
    }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
        provider: unknown;
        callbackURL?: string | undefined;
        idToken?: {
            token: string;
            nonce?: string | undefined;
            accessToken?: string | undefined;
            refreshToken?: string | undefined;
            scopes?: string[] | undefined;
        } | undefined;
        requestSignUp?: boolean | undefined;
        scopes?: string[] | undefined;
        errorCallbackURL?: string | undefined;
        disableRedirect?: boolean | undefined;
        additionalData?: Record<string, any> | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
        url: string;
        redirect: boolean;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    listAccounts: <FetchOptions extends better_auth.ClientFetchOption<never, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0?: better_auth.Prettify<{
        query?: Record<string, any> | undefined;
        fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
        scopes: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        providerId: string;
        accountId: string;
    }[], {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    deleteUser: {
        callback: <FetchOptions extends better_auth.ClientFetchOption<never, Partial<{
            token: string;
            callbackURL?: string | undefined;
        }> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
            query: {
                token: string;
                callbackURL?: string | undefined;
            };
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
            success: boolean;
            message: string;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    unlinkAccount: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
        providerId: string;
        accountId?: string | undefined;
    }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
        providerId: string;
        accountId?: string | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
        status: boolean;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    refreshToken: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
        providerId: string;
        accountId?: string | undefined;
        userId?: string | undefined;
    }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
        providerId: string;
        accountId?: string | undefined;
        userId?: string | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
        accessToken: string | undefined;
        refreshToken: string;
        accessTokenExpiresAt: Date | undefined;
        refreshTokenExpiresAt: Date | null | undefined;
        scope: string | null | undefined;
        idToken: string | null | undefined;
        providerId: string;
        accountId: string;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    getAccessToken: <FetchOptions extends better_auth.ClientFetchOption<Partial<{
        providerId: string;
        accountId?: string | undefined;
        userId?: string | undefined;
    }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: better_auth.Prettify<{
        providerId: string;
        accountId?: string | undefined;
        userId?: string | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
        accessToken: string;
        accessTokenExpiresAt: Date | undefined;
        scopes: string[];
        idToken: string | undefined;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    accountInfo: <FetchOptions extends better_auth.ClientFetchOption<never, Partial<{
        accountId?: string | undefined;
    }> & Record<string, any>, Record<string, any> | undefined>>(data_0?: better_auth.Prettify<{
        query?: {
            accountId?: string | undefined;
        } | undefined;
        fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
        user: better_auth.OAuth2UserInfo;
        data: Record<string, any>;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    getSession: <FetchOptions extends better_auth.ClientFetchOption<never, Partial<{
        disableCookieCache?: unknown;
        disableRefresh?: unknown;
    }> & Record<string, any>, Record<string, any> | undefined>>(data_0?: better_auth.Prettify<{
        query?: {
            disableCookieCache?: unknown;
            disableRefresh?: unknown;
        } | undefined;
        fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<_better_fetch_fetch.BetterFetchResponse<{
        user: better_auth.StripEmptyObjects<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined;
        } & {
            banned: boolean | null | undefined;
        } & {
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        }>;
        session: better_auth.StripEmptyObjects<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            expiresAt: Date;
            token: string;
            ipAddress?: string | null | undefined;
            userAgent?: string | null | undefined;
        } & {} & {
            impersonatedBy?: string | null | undefined;
        } & {} & {
            activeOrganizationId?: string | null | undefined;
        }>;
    } | null, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    admin: {
        checkRolePermission: <R extends "user" | "admin">(data: {
            permissions: {
                readonly user?: ("create" | "list" | "set-role" | "ban" | "impersonate" | "impersonate-admins" | "delete" | "set-password" | "get" | "update")[] | undefined;
                readonly session?: ("list" | "delete" | "revoke")[] | undefined;
            };
        } & {
            role: R;
        }) => boolean;
    };
} & {
    $Infer: {
        ActiveOrganization: {
            members: {
                id: string;
                organizationId: string;
                role: "admin" | "member" | "owner";
                createdAt: Date;
                userId: string;
                user: {
                    id: string;
                    email: string;
                    name: string;
                    image?: string | undefined;
                };
            }[];
            invitations: {
                id: string;
                organizationId: string;
                email: string;
                role: "admin" | "member" | "owner";
                status: better_auth_plugins.InvitationStatus;
                inviterId: string;
                expiresAt: Date;
                createdAt: Date;
            }[];
        } & {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            logo?: string | null | undefined | undefined;
            metadata?: any;
        };
        Organization: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            logo?: string | null | undefined;
            metadata?: any;
        };
        Invitation: {
            id: string;
            organizationId: string;
            email: string;
            role: "admin" | "member" | "owner";
            status: better_auth_plugins.InvitationStatus;
            inviterId: string;
            expiresAt: Date;
            createdAt: Date;
        };
        Member: {
            id: string;
            organizationId: string;
            role: "admin" | "member" | "owner";
            createdAt: Date;
            userId: string;
            user: {
                id: string;
                email: string;
                name: string;
                image?: string | undefined;
            };
        };
        Team: {
            id: string;
            name: string;
            organizationId: string;
            createdAt: Date;
            updatedAt?: Date | undefined;
        };
    };
    organization: {
        checkRolePermission: <R extends "admin" | "member" | "owner">(data: {
            permissions: {
                readonly organization?: ("delete" | "update")[] | undefined;
                readonly member?: ("create" | "delete" | "update")[] | undefined;
                readonly invitation?: ("cancel" | "create")[] | undefined;
                readonly team?: ("create" | "delete" | "update")[] | undefined;
                readonly ac?: ("create" | "delete" | "update" | "read")[] | undefined;
            };
        } & {
            role: R;
        }) => boolean;
    };
} & {
    useSession: () => {
        data: {
            user: better_auth.StripEmptyObjects<{
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            } & {
                banned: boolean | null | undefined;
            } & {
                role?: string | null | undefined;
                banReason?: string | null | undefined;
                banExpires?: Date | null | undefined;
            }>;
            session: better_auth.StripEmptyObjects<{
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                expiresAt: Date;
                token: string;
                ipAddress?: string | null | undefined;
                userAgent?: string | null | undefined;
            } & {} & {
                impersonatedBy?: string | null | undefined;
            } & {} & {
                activeOrganizationId?: string | null | undefined;
            }>;
        } | null;
        isPending: boolean;
        isRefetching: boolean;
        error: _better_fetch_fetch.BetterFetchError | null;
        refetch: (queryParams?: {
            query?: better_auth.SessionQueryParams;
        } | undefined) => Promise<void>;
    };
    $Infer: {
        Session: {
            user: better_auth.StripEmptyObjects<{
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            } & {
                banned: boolean | null | undefined;
            } & {
                role?: string | null | undefined;
                banReason?: string | null | undefined;
                banExpires?: Date | null | undefined;
            }>;
            session: better_auth.StripEmptyObjects<{
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                expiresAt: Date;
                token: string;
                ipAddress?: string | null | undefined;
                userAgent?: string | null | undefined;
            } & {} & {
                impersonatedBy?: string | null | undefined;
            } & {} & {
                activeOrganizationId?: string | null | undefined;
            }>;
        };
    };
    $fetch: _better_fetch_fetch.BetterFetch<{
        plugins: (_better_fetch_fetch.BetterFetchPlugin<Record<string, any>> | {
            id: string;
            name: string;
            hooks: {
                onSuccess(context: _better_fetch_fetch.SuccessContext<any>): void;
            };
        } | {
            id: string;
            name: string;
            hooks: {
                onSuccess: ((context: _better_fetch_fetch.SuccessContext<any>) => Promise<void> | void) | undefined;
                onError: ((context: _better_fetch_fetch.ErrorContext) => Promise<void> | void) | undefined;
                onRequest: (<T extends Record<string, any>>(context: _better_fetch_fetch.RequestContext<T>) => Promise<_better_fetch_fetch.RequestContext | void> | _better_fetch_fetch.RequestContext | void) | undefined;
                onResponse: ((context: _better_fetch_fetch.ResponseContext) => Promise<Response | void | _better_fetch_fetch.ResponseContext> | Response | _better_fetch_fetch.ResponseContext | void) | undefined;
            };
        })[];
        cache?: RequestCache | undefined;
        priority?: RequestPriority | undefined;
        credentials?: RequestCredentials;
        headers?: (HeadersInit & (HeadersInit | {
            accept: "application/json" | "text/plain" | "application/octet-stream";
            "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
            authorization: "Bearer" | "Basic";
        })) | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        method: string;
        mode?: RequestMode | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        window?: null | undefined;
        onRetry?: ((response: _better_fetch_fetch.ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
            cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl: _better_fetch_fetch.FetchEsque;
        baseURL: string;
        throw?: boolean | undefined;
        auth?: ({
            type: "Bearer";
            token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
            type: "Basic";
            username: string | (() => string | undefined) | undefined;
            password: string | (() => string | undefined) | undefined;
        } | {
            type: "Custom";
            prefix: string | (() => string | undefined) | undefined;
            value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: any;
        query?: any;
        params?: any;
        duplex?: "full" | "half" | undefined;
        jsonParser: (text: string) => Promise<any> | any;
        retry?: _better_fetch_fetch.RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (_better_fetch_fetch.StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: _better_fetch_fetch.StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
        disableSignal?: boolean | undefined;
    }, unknown, unknown, {}>;
    $store: {
        notify: (signal?: (Omit<string, "$sessionSignal"> | "$sessionSignal") | undefined) => void;
        listen: (signal: Omit<string, "$sessionSignal"> | "$sessionSignal", listener: (value: boolean, oldValue?: boolean | undefined) => void) => void;
        atoms: Record<string, nanostores.WritableAtom<any>>;
    };
    $ERROR_CODES: {
        USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: better_auth.RawError<"USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL">;
        FAILED_TO_CREATE_USER: better_auth.RawError<"FAILED_TO_CREATE_USER">;
        USER_ALREADY_EXISTS: better_auth.RawError<"USER_ALREADY_EXISTS">;
        YOU_CANNOT_BAN_YOURSELF: better_auth.RawError<"YOU_CANNOT_BAN_YOURSELF">;
        YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE">;
        YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS">;
        YOU_ARE_NOT_ALLOWED_TO_LIST_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_LIST_USERS">;
        YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS">;
        YOU_ARE_NOT_ALLOWED_TO_BAN_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_BAN_USERS">;
        YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS">;
        YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS">;
        YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS">;
        YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD">;
        BANNED_USER: better_auth.RawError<"BANNED_USER">;
        YOU_ARE_NOT_ALLOWED_TO_GET_USER: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_GET_USER">;
        NO_DATA_TO_UPDATE: better_auth.RawError<"NO_DATA_TO_UPDATE">;
        YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS">;
        YOU_CANNOT_REMOVE_YOURSELF: better_auth.RawError<"YOU_CANNOT_REMOVE_YOURSELF">;
        YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE">;
        YOU_CANNOT_IMPERSONATE_ADMINS: better_auth.RawError<"YOU_CANNOT_IMPERSONATE_ADMINS">;
        INVALID_ROLE_TYPE: better_auth.RawError<"INVALID_ROLE_TYPE">;
    } & {
        YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION">;
        YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS: better_auth.RawError<"YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS">;
        ORGANIZATION_ALREADY_EXISTS: better_auth.RawError<"ORGANIZATION_ALREADY_EXISTS">;
        ORGANIZATION_SLUG_ALREADY_TAKEN: better_auth.RawError<"ORGANIZATION_SLUG_ALREADY_TAKEN">;
        ORGANIZATION_NOT_FOUND: better_auth.RawError<"ORGANIZATION_NOT_FOUND">;
        USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION: better_auth.RawError<"USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION">;
        YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_ORGANIZATION: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_ORGANIZATION">;
        YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_ORGANIZATION: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_ORGANIZATION">;
        NO_ACTIVE_ORGANIZATION: better_auth.RawError<"NO_ACTIVE_ORGANIZATION">;
        USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION: better_auth.RawError<"USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION">;
        MEMBER_NOT_FOUND: better_auth.RawError<"MEMBER_NOT_FOUND">;
        ROLE_NOT_FOUND: better_auth.RawError<"ROLE_NOT_FOUND">;
        YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM">;
        TEAM_ALREADY_EXISTS: better_auth.RawError<"TEAM_ALREADY_EXISTS">;
        TEAM_NOT_FOUND: better_auth.RawError<"TEAM_NOT_FOUND">;
        YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER: better_auth.RawError<"YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER">;
        YOU_CANNOT_LEAVE_THE_ORGANIZATION_WITHOUT_AN_OWNER: better_auth.RawError<"YOU_CANNOT_LEAVE_THE_ORGANIZATION_WITHOUT_AN_OWNER">;
        YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_MEMBER: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_MEMBER">;
        YOU_ARE_NOT_ALLOWED_TO_INVITE_USERS_TO_THIS_ORGANIZATION: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_INVITE_USERS_TO_THIS_ORGANIZATION">;
        USER_IS_ALREADY_INVITED_TO_THIS_ORGANIZATION: better_auth.RawError<"USER_IS_ALREADY_INVITED_TO_THIS_ORGANIZATION">;
        INVITATION_NOT_FOUND: better_auth.RawError<"INVITATION_NOT_FOUND">;
        YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION: better_auth.RawError<"YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION">;
        EMAIL_VERIFICATION_REQUIRED_BEFORE_ACCEPTING_OR_REJECTING_INVITATION: better_auth.RawError<"EMAIL_VERIFICATION_REQUIRED_BEFORE_ACCEPTING_OR_REJECTING_INVITATION">;
        YOU_ARE_NOT_ALLOWED_TO_CANCEL_THIS_INVITATION: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_CANCEL_THIS_INVITATION">;
        INVITER_IS_NO_LONGER_A_MEMBER_OF_THE_ORGANIZATION: better_auth.RawError<"INVITER_IS_NO_LONGER_A_MEMBER_OF_THE_ORGANIZATION">;
        YOU_ARE_NOT_ALLOWED_TO_INVITE_USER_WITH_THIS_ROLE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_INVITE_USER_WITH_THIS_ROLE">;
        FAILED_TO_RETRIEVE_INVITATION: better_auth.RawError<"FAILED_TO_RETRIEVE_INVITATION">;
        YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_TEAMS: better_auth.RawError<"YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_TEAMS">;
        UNABLE_TO_REMOVE_LAST_TEAM: better_auth.RawError<"UNABLE_TO_REMOVE_LAST_TEAM">;
        YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_MEMBER: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_MEMBER">;
        ORGANIZATION_MEMBERSHIP_LIMIT_REACHED: better_auth.RawError<"ORGANIZATION_MEMBERSHIP_LIMIT_REACHED">;
        YOU_ARE_NOT_ALLOWED_TO_CREATE_TEAMS_IN_THIS_ORGANIZATION: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_TEAMS_IN_THIS_ORGANIZATION">;
        YOU_ARE_NOT_ALLOWED_TO_DELETE_TEAMS_IN_THIS_ORGANIZATION: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_TEAMS_IN_THIS_ORGANIZATION">;
        YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_TEAM: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_TEAM">;
        YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_TEAM: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_TEAM">;
        INVITATION_LIMIT_REACHED: better_auth.RawError<"INVITATION_LIMIT_REACHED">;
        TEAM_MEMBER_LIMIT_REACHED: better_auth.RawError<"TEAM_MEMBER_LIMIT_REACHED">;
        USER_IS_NOT_A_MEMBER_OF_THE_TEAM: better_auth.RawError<"USER_IS_NOT_A_MEMBER_OF_THE_TEAM">;
        YOU_CAN_NOT_ACCESS_THE_MEMBERS_OF_THIS_TEAM: better_auth.RawError<"YOU_CAN_NOT_ACCESS_THE_MEMBERS_OF_THIS_TEAM">;
        YOU_DO_NOT_HAVE_AN_ACTIVE_TEAM: better_auth.RawError<"YOU_DO_NOT_HAVE_AN_ACTIVE_TEAM">;
        YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM_MEMBER: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM_MEMBER">;
        YOU_ARE_NOT_ALLOWED_TO_REMOVE_A_TEAM_MEMBER: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_REMOVE_A_TEAM_MEMBER">;
        YOU_ARE_NOT_ALLOWED_TO_ACCESS_THIS_ORGANIZATION: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_ACCESS_THIS_ORGANIZATION">;
        YOU_ARE_NOT_A_MEMBER_OF_THIS_ORGANIZATION: better_auth.RawError<"YOU_ARE_NOT_A_MEMBER_OF_THIS_ORGANIZATION">;
        MISSING_AC_INSTANCE: better_auth.RawError<"MISSING_AC_INSTANCE">;
        YOU_MUST_BE_IN_AN_ORGANIZATION_TO_CREATE_A_ROLE: better_auth.RawError<"YOU_MUST_BE_IN_AN_ORGANIZATION_TO_CREATE_A_ROLE">;
        YOU_ARE_NOT_ALLOWED_TO_CREATE_A_ROLE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_A_ROLE">;
        YOU_ARE_NOT_ALLOWED_TO_UPDATE_A_ROLE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_UPDATE_A_ROLE">;
        YOU_ARE_NOT_ALLOWED_TO_DELETE_A_ROLE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_A_ROLE">;
        YOU_ARE_NOT_ALLOWED_TO_READ_A_ROLE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_READ_A_ROLE">;
        YOU_ARE_NOT_ALLOWED_TO_LIST_A_ROLE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_LIST_A_ROLE">;
        YOU_ARE_NOT_ALLOWED_TO_GET_A_ROLE: better_auth.RawError<"YOU_ARE_NOT_ALLOWED_TO_GET_A_ROLE">;
        TOO_MANY_ROLES: better_auth.RawError<"TOO_MANY_ROLES">;
        INVALID_RESOURCE: better_auth.RawError<"INVALID_RESOURCE">;
        ROLE_NAME_IS_ALREADY_TAKEN: better_auth.RawError<"ROLE_NAME_IS_ALREADY_TAKEN">;
        CANNOT_DELETE_A_PRE_DEFINED_ROLE: better_auth.RawError<"CANNOT_DELETE_A_PRE_DEFINED_ROLE">;
        ROLE_IS_ASSIGNED_TO_MEMBERS: better_auth.RawError<"ROLE_IS_ASSIGNED_TO_MEMBERS">;
    } & {
        USER_NOT_FOUND: better_auth.RawError<"USER_NOT_FOUND">;
        FAILED_TO_CREATE_USER: better_auth.RawError<"FAILED_TO_CREATE_USER">;
        FAILED_TO_CREATE_SESSION: better_auth.RawError<"FAILED_TO_CREATE_SESSION">;
        FAILED_TO_UPDATE_USER: better_auth.RawError<"FAILED_TO_UPDATE_USER">;
        FAILED_TO_GET_SESSION: better_auth.RawError<"FAILED_TO_GET_SESSION">;
        INVALID_PASSWORD: better_auth.RawError<"INVALID_PASSWORD">;
        INVALID_EMAIL: better_auth.RawError<"INVALID_EMAIL">;
        INVALID_EMAIL_OR_PASSWORD: better_auth.RawError<"INVALID_EMAIL_OR_PASSWORD">;
        INVALID_USER: better_auth.RawError<"INVALID_USER">;
        SOCIAL_ACCOUNT_ALREADY_LINKED: better_auth.RawError<"SOCIAL_ACCOUNT_ALREADY_LINKED">;
        PROVIDER_NOT_FOUND: better_auth.RawError<"PROVIDER_NOT_FOUND">;
        INVALID_TOKEN: better_auth.RawError<"INVALID_TOKEN">;
        TOKEN_EXPIRED: better_auth.RawError<"TOKEN_EXPIRED">;
        ID_TOKEN_NOT_SUPPORTED: better_auth.RawError<"ID_TOKEN_NOT_SUPPORTED">;
        FAILED_TO_GET_USER_INFO: better_auth.RawError<"FAILED_TO_GET_USER_INFO">;
        USER_EMAIL_NOT_FOUND: better_auth.RawError<"USER_EMAIL_NOT_FOUND">;
        EMAIL_NOT_VERIFIED: better_auth.RawError<"EMAIL_NOT_VERIFIED">;
        PASSWORD_TOO_SHORT: better_auth.RawError<"PASSWORD_TOO_SHORT">;
        PASSWORD_TOO_LONG: better_auth.RawError<"PASSWORD_TOO_LONG">;
        USER_ALREADY_EXISTS: better_auth.RawError<"USER_ALREADY_EXISTS">;
        USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: better_auth.RawError<"USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL">;
        EMAIL_CAN_NOT_BE_UPDATED: better_auth.RawError<"EMAIL_CAN_NOT_BE_UPDATED">;
        CREDENTIAL_ACCOUNT_NOT_FOUND: better_auth.RawError<"CREDENTIAL_ACCOUNT_NOT_FOUND">;
        ACCOUNT_NOT_FOUND: better_auth.RawError<"ACCOUNT_NOT_FOUND">;
        SESSION_EXPIRED: better_auth.RawError<"SESSION_EXPIRED">;
        FAILED_TO_UNLINK_LAST_ACCOUNT: better_auth.RawError<"FAILED_TO_UNLINK_LAST_ACCOUNT">;
        USER_ALREADY_HAS_PASSWORD: better_auth.RawError<"USER_ALREADY_HAS_PASSWORD">;
        CROSS_SITE_NAVIGATION_LOGIN_BLOCKED: better_auth.RawError<"CROSS_SITE_NAVIGATION_LOGIN_BLOCKED">;
        VERIFICATION_EMAIL_NOT_ENABLED: better_auth.RawError<"VERIFICATION_EMAIL_NOT_ENABLED">;
        EMAIL_ALREADY_VERIFIED: better_auth.RawError<"EMAIL_ALREADY_VERIFIED">;
        EMAIL_MISMATCH: better_auth.RawError<"EMAIL_MISMATCH">;
        SESSION_NOT_FRESH: better_auth.RawError<"SESSION_NOT_FRESH">;
        LINKED_ACCOUNT_ALREADY_EXISTS: better_auth.RawError<"LINKED_ACCOUNT_ALREADY_EXISTS">;
        INVALID_ORIGIN: better_auth.RawError<"INVALID_ORIGIN">;
        INVALID_CALLBACK_URL: better_auth.RawError<"INVALID_CALLBACK_URL">;
        INVALID_REDIRECT_URL: better_auth.RawError<"INVALID_REDIRECT_URL">;
        INVALID_ERROR_CALLBACK_URL: better_auth.RawError<"INVALID_ERROR_CALLBACK_URL">;
        INVALID_NEW_USER_CALLBACK_URL: better_auth.RawError<"INVALID_NEW_USER_CALLBACK_URL">;
        MISSING_OR_NULL_ORIGIN: better_auth.RawError<"MISSING_OR_NULL_ORIGIN">;
        CALLBACK_URL_REQUIRED: better_auth.RawError<"CALLBACK_URL_REQUIRED">;
        FAILED_TO_CREATE_VERIFICATION: better_auth.RawError<"FAILED_TO_CREATE_VERIFICATION">;
        FIELD_NOT_ALLOWED: better_auth.RawError<"FIELD_NOT_ALLOWED">;
        ASYNC_VALIDATION_NOT_SUPPORTED: better_auth.RawError<"ASYNC_VALIDATION_NOT_SUPPORTED">;
        VALIDATION_ERROR: better_auth.RawError<"VALIDATION_ERROR">;
        MISSING_FIELD: better_auth.RawError<"MISSING_FIELD">;
        METHOD_NOT_ALLOWED_DEFER_SESSION_REQUIRED: better_auth.RawError<"METHOD_NOT_ALLOWED_DEFER_SESSION_REQUIRED">;
        BODY_MUST_BE_AN_OBJECT: better_auth.RawError<"BODY_MUST_BE_AN_OBJECT">;
        PASSWORD_ALREADY_SET: better_auth.RawError<"PASSWORD_ALREADY_SET">;
    };
};
/** Inferred type of the auth client for use in type annotations */
type TruckConnectClient = ReturnType<typeof createTruckConnectClient>;
/** All org types used in the TruckConnect platform */
type OrgType = "tc_platform" | "enterprise_shipper" | "msme_shipper" | "carrier_fleet" | "freight_forwarder" | "warehouse_operator";
/** Platform-level user roles (admin plugin) */
type PlatformRole = "user" | "admin" | "super_admin";
/** Org-level member roles */
type OrgRole = "owner" | "admin" | "member" | "super_admin" | "compliance_officer" | "dispute_manager" | "support_agent" | "ai_supervisor" | "data_quality" | "enterprise_admin" | "booker" | "viewer" | "shipper_admin" | "forwarder_admin" | "agent" | "carrier_owner" | "dispatcher" | "driver" | "warehouse_admin" | "warehouse_manager" | "warehouse_staff" | "warehouse_viewer";
declare const ORG_TYPE_LABELS: Record<OrgType, string>;
declare const ORG_ROLE_LABELS: Record<OrgRole, string>;
/**
 * Roles that can manage an org (invite, remove, change roles).
 * Must stay in sync with truckconnect-auth/lib/auth/constants.ts
 * @see ../truckconnect-auth/lib/auth/constants.ts
 */
declare const ORG_ADMIN_ROLES: Set<OrgRole>;

export { ORG_ADMIN_ROLES, ORG_ROLE_LABELS, ORG_TYPE_LABELS, type OrgRole, type OrgType, type PlatformRole, type TruckConnectClient, type TruckConnectClientOptions, createTruckConnectClient };
