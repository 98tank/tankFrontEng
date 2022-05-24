import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AdminGuard, AuthGuard, ClientGuard, RecruiterGuard} from './guards';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro-cliente',
    loadChildren: () => import('./pages/register-client/register-client.module').then( m => m.RegisterClientPageModule)
  },
  {
    path: 'registro-reclutador',
    loadChildren: () => import('./pages/register-recruiter/register-recruiter.module').then( m => m.RegisterRecruiterPageModule)
  },
  {
    path: 'registro-admin',
    loadChildren: () => import('./pages/register-admin/register-admin.module').then( m => m.RegisterAdminPageModule)
  },
  {
    path: 'cliente/principal',
    loadChildren: () => import('./pages/client/main/main.module').then( m => m.MainPageModule),
    canLoad: [ AuthGuard, ClientGuard]
  },
  {
    path: 'cliente/crear-mision',
    loadChildren: () => import('./pages/client/create-mission/create-mission.module').then( m => m.CreateMissionPageModule),
    canLoad: [ AuthGuard, ClientGuard]
  },
  {
    path: 'cliente/misiones-en-revision',
    loadChildren: () => import('./pages/client/mission-under-review/mission-under-review.module').then( m => m.MissionUnderReviewPageModule),
    canLoad: [ AuthGuard, ClientGuard]
  },
  {
    path: 'cliente/misiones-activas',
    loadChildren: () => import('./pages/client/active-missions/active-missions.module').then( m => m.ActiveMissionsPageModule),
    canLoad: [ AuthGuard, ClientGuard]
  },
  {
    path: 'cliente/misiones-canceladas',
    loadChildren: () => import('./pages/client/missions-canceled/missions-canceled.module').then( m => m.MissionsCanceledPageModule),
    canLoad: [ AuthGuard, ClientGuard]
  },
  {
    path: 'cliente/misiones-culminadas',
    loadChildren: () => import('./pages/client/missions-completed/missions-completed.module').then( m => m.MissionsCompletedPageModule),
    canLoad: [ AuthGuard, ClientGuard]
  },
  {
    path: 'cliente/todos-los-candidates',
    loadChildren: () => import('./pages/client/all-candidates/all-candidates.module').then( m => m.AllCandidatesPageModule)
  },
  {
    path: 'cliente/historial-de-pago',
    loadChildren: () => import('./pages/client/payment-history/payment-history.module').then( m => m.PaymentHistoryPageModule),
    canLoad: [ AuthGuard, ClientGuard]
  },
  {
    path: 'cliente/futuras-entrevistas',
    loadChildren: () => import('./pages/client/future-interviews/future-interviews.module').then( m => m.FutureInterviewsPageModule),
    canLoad: [ AuthGuard, ClientGuard]
  },
  {
    path: 'cliente/editar-perfil',
    loadChildren: () => import('./pages/client/edit-my-account/edit-my-account.module').then( m => m.EditMyAccountPageModule),
    canLoad: [ AuthGuard, ClientGuard]
  },
  {
    path: 'cliente/misiones-activas/mision/:id',
    loadChildren: () => import('./pages/client/mission/mission.module').then( m => m.MissionPageModule),
    canLoad: [ AuthGuard, ClientGuard]
  },
  {
    path: 'cliente/misiones-activas/mision/candidato/:id',
    loadChildren: () => import('./pages/client/candidate/candidate.module').then( m => m.CandidatePageModule),
    canLoad: [ AuthGuard, ClientGuard]
  },
  {
    path: 'contratar',
    loadChildren: () => import('./pages/client/contract/contract.module').then( m => m.ContractPageModule),
    canLoad: [ AuthGuard, ClientGuard]
  },
  {
    path: 'reclutador/principal',
    loadChildren: () => import('./pages/recruiter/main/main.module').then( m => m.MainPageModule),
    canLoad: [ AuthGuard, RecruiterGuard]
  },
  {
    path: 'reclutador/misiones-activas',
    loadChildren: () => import('./pages/recruiter/active-missions/active-missions.module').then( m => m.ActiveMissionsPageModule),
    canLoad: [ AuthGuard, RecruiterGuard]
  },
  {
    path: 'reclutador/misiones-elegidas',
    loadChildren: () => import('./pages/recruiter/selected-missions/selected-missions.module').then( m => m.SelectedMissionsPageModule),
    canLoad: [ AuthGuard, RecruiterGuard]
  },
  {
    path: 'reclutador/misiones-culminadas',
    loadChildren: () => import('./pages/recruiter/missions-completed/missions-completed.module').then( m => m.MissionsCompletedPageModule),
    canLoad: [ AuthGuard, RecruiterGuard]
  },
  {
    path: 'reclutador/historial-de-pago',
    loadChildren: () => import('./pages/recruiter/payment-history/payment-history.module').then( m => m.PaymentHistoryPageModule),
    canLoad: [ AuthGuard, RecruiterGuard]
  },
  {
    path: 'reclutador/futuras-entrevistas',
    loadChildren: () => import('./pages/recruiter/future-interviews/future-interviews.module').then( m => m.FutureInterviewsPageModule),
    canLoad: [ AuthGuard, RecruiterGuard]
  },
  {
    path: 'reclutador/editar-perfil',
    loadChildren: () => import('./pages/recruiter/edit-my-account/edit-my-account.module').then( m => m.EditMyAccountPageModule),
    canLoad: [ AuthGuard, RecruiterGuard]
  },
  {
    path: 'reclutador/misiones-activas/mision/:id',
    loadChildren: () => import('./pages/recruiter/mission/mission.module').then( m => m.MissionPageModule),
    canLoad: [ AuthGuard, RecruiterGuard]
  },
  {
    path: 'reclutador/misiones-elegidas/mision/:id',
    loadChildren: () => import('./pages/recruiter/mission/mission.module').then( m => m.MissionPageModule),
    canLoad: [ AuthGuard, RecruiterGuard]
  },
  {
    path: 'reclutador/misiones-elegidas/mision/crear-candidato/:id',
    loadChildren: () => import('./pages/recruiter/create-candidate/create-candidate.module').then( m => m.CreateCandidatePageModule),
    canLoad: [ AuthGuard, RecruiterGuard]
  },
  {
    path: 'reclutador/misiones-activas/mision/crear-candidato/:id',
    loadChildren: () => import('./pages/recruiter/create-candidate/create-candidate.module').then( m => m.CreateCandidatePageModule),
    canLoad: [ AuthGuard, RecruiterGuard]
  },
  {
    path: 'reclutador/misiones-elegidas/mision/candidato/:id',
    loadChildren: () => import('./pages/recruiter/candidate-recruiter/candidate-recruiter.module').then( m => m.CandidateRecruiterPageModule),
    canLoad: [ AuthGuard, RecruiterGuard]
  },
  {
    path: 'admin/principal',
    loadChildren: () => import('./pages/admin/main/main.module').then( m => m.MainPageModule),
    canLoad: [ AuthGuard, AdminGuard]
  },
  {
    path: 'admin/clientes',
    loadChildren: () => import('./pages/admin/all-clients/all-clients.module').then( m => m.AllClientsPageModule),
    canLoad: [ AuthGuard, AdminGuard ]
  },
  {
    path: 'admin/clientes/:id',
    loadChildren: () => import('./pages/admin/client/client.module').then( m => m.ClientPageModule),
    canLoad: [ AuthGuard, AdminGuard ]
  },
  {
    path: 'admin/reclutadores',
    loadChildren: () => import('./pages/admin/all-recruiters/all-recruiters.module').then( m => m.AllRecruitersPageModule),
    canLoad: [ AuthGuard, AdminGuard ]
  },
  {
    path: 'admin/reclutador/:id',
    loadChildren: () => import('./pages/admin/recruiter/recruiter.module').then( m => m.RecruiterPageModule),
    canLoad: [ AuthGuard, AdminGuard ]
  },
  {
    path: 'admin/candidatos',
    loadChildren: () => import('./pages/admin/all-candidates/all-candidates.module').then( m => m.AllCandidatesPageModule),
    canLoad: [ AuthGuard, AdminGuard ]
  },
  {
    path: 'admin/candidato/:id',
    loadChildren: () => import('./pages/admin/candidate/candidate.module').then( m => m.CandidatePageModule),
    canLoad: [ AuthGuard, AdminGuard ]
  },
  {
    path: 'admin/misiones-en-revision',
    loadChildren: () => import('./pages/admin/mission-under-review/mission-under-review.module').then( m => m.MissionUnderReviewPageModule),
    canLoad: [ AuthGuard, AdminGuard ]
  },
  {
    path: 'admin/mision/:id',
    loadChildren: () => import('./pages/admin/mission/mission.module').then( m => m.MissionPageModule),
    canLoad: [ AuthGuard, AdminGuard ]
  },
  {
    path: 'admin/misiones-activas',
    loadChildren: () => import('./pages/admin/active-missions/active-missions.module').then( m => m.ActiveMissionsPageModule),
    canLoad: [ AuthGuard, AdminGuard ]
  },
  {
    path: 'admin/misiones-completadas',
    loadChildren: () => import('./pages/admin/missions-completed/missions-completed.module').then( m => m.MissionsCompletedPageModule),
    canLoad: [ AuthGuard, AdminGuard ]
  },
  {
    path: 'admin/misiones-canceladas',
    loadChildren: () => import('./pages/admin/missions-canceled/missions-canceled.module').then( m => m.MissionsCanceledPageModule),
    canLoad: [ AuthGuard, AdminGuard ]
  },
  {
    path: 'admin/users-admin',
    loadChildren: () => import('./pages/admin/users-admin/users-admin.module').then( m => m.UsersAdminPageModule),
    canLoad: [ AuthGuard, AdminGuard ]
  },
  {
    path: 'admin/edit-my-account',
    loadChildren: () => import('./pages/admin/edit-my-account/edit-my-account.module').then( m => m.EditMyAccountPageModule),
    canLoad: [ AuthGuard, AdminGuard ]
  },
  {
    path: 'admin/payment-history',
    loadChildren: () => import('./pages/admin/payment-history/payment-history.module').then( m => m.PaymentHistoryPageModule),
    canLoad: [ AuthGuard, AdminGuard ]
  },
  {
    path: 'admin/payment-history/complete',
    loadChildren: () => import('./pages/admin/payment-history-complete/payment-history-complete.module').then( m => m.PaymentHistoryCompletePageModule),
    canLoad: [ AuthGuard, AdminGuard ]
  },
  {
    path: 'admin/payment-history/pending',
    loadChildren: () => import('./pages/admin/payment-history-pending/payment-history-pending.module').then( m => m.PaymentHistoryPendingPageModule),
    canLoad: [ AuthGuard, AdminGuard ]
  },
  {
    path: 'admin/payment-history/rewards',
    loadChildren: () => import('./pages/admin/payment-history-rewards/payment-history-rewards.module').then( m => m.PaymentHistoryRewardsPageModule),
    canLoad: [ AuthGuard, AdminGuard ]
  },
  {
    path: 'admin/user-search',
    loadChildren: () => import('./pages/admin/user-search/user-search.module').then( m => m.UserSearchPageModule),
    canLoad: [ AuthGuard, AdminGuard ]
  },
  {
    path: 'admin/payment-history/returns',
    loadChildren: () => import('./pages/admin/payment-history-returns/payment-history-returns.module').then( m => m.PaymentHistoryReturnsPageModule),
    canLoad: [ AuthGuard, AdminGuard ]
  },
  {
    path: 'admin/invitations',
    loadChildren: () => import('./pages/admin/invitations/invitations.module').then( m => m.InvitationsPageModule),
    canLoad: [ AuthGuard, AdminGuard ]
  },
  {
    path: '**',
    redirectTo: 'cliente/principal',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
