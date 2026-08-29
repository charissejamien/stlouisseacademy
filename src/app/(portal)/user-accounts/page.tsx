import InviteUser from "@/components/user-accounts/InviteUser"
import UsersList from "@/components/user-accounts/UsersList"

export default function UserAccountsPage() {
  return (
    <div className="w-[90%] lg:w-[80%] mx-auto mt-20 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Manage User Accounts
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage users, roles, and account access.
          </p>
        </div>

        <InviteUser />
      </div>

      <UsersList />
    </div>
  )
}
