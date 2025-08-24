import type { Cip30Api } from "@/types"

// Wallet connection utilities
export class WalletManager {
  private static instance: WalletManager
  private connectedWallet: Cip30Api | null = null
  private walletType: string | null = null

  static getInstance(): WalletManager {
    if (!WalletManager.instance) {
      WalletManager.instance = new WalletManager()
    }
    return WalletManager.instance
  }

  async connectLace(): Promise<{ success: boolean; api?: Cip30Api; error?: string }> {
    try {
      const anyWindow = window as any
      const provider = anyWindow?.cardano?.lace

      if (!provider?.enable) {
        return {
          success: false,
          error: "Lace wallet not found. Please install or enable Lace wallet.",
        }
      }

      const api: Cip30Api = await provider.enable()
      this.connectedWallet = api
      this.walletType = "lace"

      return { success: true, api }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to connect to Lace wallet",
      }
    }
  }

  getConnectedWallet(): { api: Cip30Api | null; type: string | null } {
    return {
      api: this.connectedWallet,
      type: this.walletType,
    }
  }

  disconnect(): void {
    this.connectedWallet = null
    this.walletType = null
  }

  isConnected(): boolean {
    return this.connectedWallet !== null
  }
}

// Wallet connection hook-like function
export function useWallet() {
  const manager = WalletManager.getInstance()

  return {
    connect: () => manager.connectLace(),
    disconnect: () => manager.disconnect(),
    isConnected: () => manager.isConnected(),
    getWallet: () => manager.getConnectedWallet(),
  }
}
