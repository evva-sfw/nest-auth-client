
export interface AuthClientModuleOptions {

    /**
     * SFW Auth service Endpoint
     */
    sfwAuthEndpoint: string;
    /**
     * SFW Auth Service tenant
     */
    sfwAuthTenant: string;
    /**
     * SFW Auth Service client identifier
     */
    sfwAuthClientId: string;
    /**
     * SFW Auth Service client secret
     */
    sfwAuthClientSecret: string;
    /**
     * SFW Auth Service requested token validity.
     */
    sfwAuthValidity?: number;

    /**
     * Vault Service endpoint.
     */
    vaultEndpoint?: string;

    /**
     * Vault Service CA.
     */
    vaultCA?: string;

    /**
     * Vault Service role id.
     */
    vaultRoleId?: string;

}
