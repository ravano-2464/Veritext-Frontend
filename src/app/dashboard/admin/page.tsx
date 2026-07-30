'use client';

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, ShieldCheck, ShieldPlus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PageSizeOption, PaginationControls } from '@/components/common/pagination-controls';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDashboardCopy } from '@/components/providers/i18n-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/hooks/use-auth';
import { adminService } from '@/services/admin.service';
import type { AdminUser } from '@/services/admin.service';

export default function AdminPage() {
  const { refresh, tokens, user } = useAuth();
  const copy = useDashboardCopy('admin');
  const queryClient = useQueryClient();
  const [userToDelete, setUserToDelete] = React.useState<AdminUser | null>(null);
  const [isRefreshingRole, setIsRefreshingRole] = React.useState(false);
  const [usersPage, setUsersPage] = React.useState(1);
  const [usersPageSize, setUsersPageSize] = React.useState<PageSizeOption>(10);
  const [apiMonitoringPage, setApiMonitoringPage] = React.useState(1);
  const [apiMonitoringPageSize, setApiMonitoringPageSize] = React.useState<PageSizeOption>(10);
  const hasCheckedRoleRef = React.useRef(false);
  const isAdmin = user?.role === 'ADMIN';

  React.useEffect(() => {
    if (!tokens?.refreshToken || isAdmin || hasCheckedRoleRef.current) {
      return;
    }

    hasCheckedRoleRef.current = true;
    setIsRefreshingRole(true);
    refresh()
      .catch(() => null)
      .finally(() => {
        setIsRefreshingRole(false);
      });
  }, [isAdmin, refresh, tokens?.refreshToken]);

  const overviewQuery = useQuery({
    queryKey: ['admin-overview'],
    queryFn: () => adminService.overview(tokens!.accessToken),
    enabled: Boolean(tokens?.accessToken && isAdmin),
  });
  const usersQuery = useQuery({
    queryKey: ['admin-users', usersPage, usersPageSize],
    queryFn: () => adminService.users(tokens!.accessToken, usersPage, usersPageSize),
    enabled: Boolean(tokens?.accessToken && isAdmin),
  });
  const apiMonitoringQuery = useQuery({
    queryKey: ['admin-api-monitoring', apiMonitoringPage, apiMonitoringPageSize],
    queryFn: () =>
      adminService.apiMonitoring(tokens!.accessToken, apiMonitoringPage, apiMonitoringPageSize),
    enabled: Boolean(tokens?.accessToken && isAdmin),
  });
  const systemQuery = useQuery({
    queryKey: ['admin-system'],
    queryFn: () => adminService.system(tokens!.accessToken),
    enabled: Boolean(tokens?.accessToken && isAdmin),
  });
  const promoteUserMutation = useMutation({
    mutationFn: (userId: string) =>
      adminService.updateUserRole(tokens!.accessToken, userId, 'ADMIN'),
    onSuccess: () => {
      toast.success(copy.toasts.roleUpdated);
      void queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : copy.toasts.roleUpdateFailed);
    },
  });
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => adminService.deleteUser(tokens!.accessToken, userId),
    onSuccess: () => {
      toast.success(copy.toasts.userDeleted);
      setUserToDelete(null);
      void queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-overview'] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : copy.toasts.userDeleteFailed);
    },
  });

  if (isRefreshingRole) {
    return (
      <Card className="border-border/60 bg-card/80">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin" />
            <div>
              <h1 className="text-xl font-semibold">{copy.refreshingRole.title}</h1>
              <p className="text-sm text-muted-foreground">{copy.refreshingRole.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isAdmin) {
    return (
      <Card className="border-border/60 bg-card/80">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck />
            <div>
              <h1 className="text-xl font-semibold">{copy.accessRequired.title}</h1>
              <p className="text-sm text-muted-foreground">{copy.accessRequired.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const overview = overviewQuery.data;
  const users = usersQuery.data ?? [];
  const apiMonitoringItems = apiMonitoringQuery.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{copy.title}</h1>
        <p className="text-muted-foreground">{copy.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {Object.entries(overview?.totals ?? {}).map(([label, value]) => (
          <Card key={label} className="border-border/60 bg-card/80">
            <CardContent className="p-4">
              <p className="text-xs uppercase text-muted-foreground">
                {copy.totals[label as keyof typeof copy.totals] || label}
              </p>
              <p className="mt-2 text-2xl font-semibold">{Number(value).toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="text-base">{copy.cards.users}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{copy.table.name}</TableHead>
                  <TableHead>{copy.table.email}</TableHead>
                  <TableHead>{copy.table.role}</TableHead>
                  <TableHead>{copy.table.provider}</TableHead>
                  <TableHead className="text-right">{copy.table.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((item) => {
                    const isCurrentUser = item.id === user?.id;
                    const isPromoting =
                      promoteUserMutation.isPending && promoteUserMutation.variables === item.id;
                    const isDeleting =
                      deleteUserMutation.isPending && deleteUserMutation.variables === item.id;

                    return (
                      <TableRow key={item.id}>
                        <TableCell>{item.fullName}</TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>
                          <Badge variant={item.role === 'ADMIN' ? 'default' : 'secondary'}>
                            {copy.roles[item.role]}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.provider}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              disabled={
                                item.role === 'ADMIN' ||
                                promoteUserMutation.isPending ||
                                deleteUserMutation.isPending
                              }
                              onClick={() => promoteUserMutation.mutate(item.id)}
                            >
                              {isPromoting ? (
                                <Loader2 className="animate-spin" data-icon="inline-start" />
                              ) : (
                                <ShieldPlus data-icon="inline-start" />
                              )}
                              {copy.actions.promote}
                            </Button>
                            <Button
                              type="button"
                              size="icon-sm"
                              variant="destructive"
                              aria-label={copy.actions.delete}
                              title={
                                isCurrentUser
                                  ? copy.actions.deleteSelfDisabled
                                  : copy.actions.delete
                              }
                              disabled={
                                isCurrentUser ||
                                promoteUserMutation.isPending ||
                                deleteUserMutation.isPending
                              }
                              onClick={() => setUserToDelete(item)}
                            >
                              {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
            <PaginationControls
              page={usersPage}
              pageSize={usersPageSize}
              canPrevious={usersPage > 1}
              canNext={users.length === usersPageSize}
              disabled={usersQuery.isFetching}
              onPageChange={setUsersPage}
              onPageSizeChange={(nextPageSize) => {
                setUsersPageSize(nextPageSize);
                setUsersPage(1);
              }}
            />
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="text-base">{copy.cards.system}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="scroll-x rounded-lg bg-muted p-4 text-sm">
              {JSON.stringify(systemQuery.data ?? {}, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">{copy.cards.apiMonitoring}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <pre className="scroll-x rounded-lg bg-muted p-4 text-sm">
            {JSON.stringify(apiMonitoringItems, null, 2)}
          </pre>
          <PaginationControls
            page={apiMonitoringPage}
            pageSize={apiMonitoringPageSize}
            canPrevious={apiMonitoringPage > 1}
            canNext={apiMonitoringItems.length === apiMonitoringPageSize}
            disabled={apiMonitoringQuery.isFetching}
            onPageChange={setApiMonitoringPage}
            onPageSizeChange={(nextPageSize) => {
              setApiMonitoringPageSize(nextPageSize);
              setApiMonitoringPage(1);
            }}
          />
        </CardContent>
      </Card>

      <AlertDialog
        open={Boolean(userToDelete)}
        onOpenChange={(open) => {
          if (!open && !deleteUserMutation.isPending) {
            setUserToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{copy.deleteDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {copy.deleteDialog.description.replace(
                '{{user}}',
                userToDelete?.email ?? copy.deleteDialog.fallbackUser,
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteUserMutation.isPending}>
              {copy.deleteDialog.cancel}
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={!userToDelete || deleteUserMutation.isPending}
              onClick={() => {
                if (userToDelete) {
                  deleteUserMutation.mutate(userToDelete.id);
                }
              }}
            >
              {deleteUserMutation.isPending && (
                <Loader2 className="animate-spin" data-icon="inline-start" />
              )}
              {copy.deleteDialog.confirm}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
