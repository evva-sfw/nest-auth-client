
export interface AuthClientModuleOptions {

    /**
     * Auth service Endpoint
     */
    authEndpoint: string;
    /**
     * Auth Service tenant
     */
    authTenant: string;
    /**
     *Auth Service client identifier
     */
    authClientId: string;
    /**
     * Auth Service client secret
     */
    authClientSecret: string;
    /**
     * Auth Service requested token validity.
     */
    authValidity?: number;

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
