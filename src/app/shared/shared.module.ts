import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttachFileComponent } from './attach-file/attach-file.component';
import { SeeAttachedComponent } from './see-attached/see-attached.component';
import { MissionCardComponent } from './mission-card/mission-card.component';
import { RouterModule } from '@angular/router';
import { MissionDataComponent } from './mission-data/mission-data.component';
import { EditMissionComponent } from './edit-mission/edit-mission.component';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { CandidateDataComponent } from './candidate-data/candidate-data.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalComponent } from './modal/modal.component';
import { RequestRefundComponent } from './request-refund/request-refund.component';
import { NoMissionsComponent } from './no-missions/no-missions.component';
import { ValidatePaymentComponent } from './validate-payment/validate-payment.component';
import { SkeletonCardComponent } from './skeleton-card/skeleton-card.component';
import { InterviewAcceptedComponent } from './interview-accepted/interview-accepted.component';
import { PendingInterviewComponent } from './pending-interview/pending-interview.component';
import { ReasonRejectionComponent } from './reason-rejection/reason-rejection.component';
import { EditCandidateComponent } from './edit-candidate/edit-candidate.component';
import { CardMissionCompletedComponent } from './card-mission-completed/card-mission-completed.component';
import { PaymentViewComponent } from './payment-view/payment-view.component';
import { PdfViewComponent } from './pdf-view/pdf-view.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NoInterviewsComponent } from './no-interviews/no-interviews.component';
import { MaterialModule } from '../material.module';
import { ItemListMissionComponent } from './item-list-mission/item-list-mission.component';
import { PipesModule } from '../pipes/pipes.module';
import { ChangeOfViewComponent } from './change-of-view/change-of-view.component';
import { EditPaymentsAdminComponent } from './edit-payments-admin/edit-payments-admin.component';
import { DateComponent } from './date/date.component';
import { PopoverComponent } from './popover/popover.component';
import { UsersSummationsComponent } from './users-summations/users-summations.component';



@NgModule({
  declarations: [
    AttachFileComponent,
    SeeAttachedComponent,
    MissionCardComponent,
    MissionDataComponent,
    EditMissionComponent,
    CandidateListComponent,
    CandidateDataComponent,
    ModalComponent,
    RequestRefundComponent,
    NoMissionsComponent,
    ValidatePaymentComponent,
    SkeletonCardComponent,
    InterviewAcceptedComponent,
    PendingInterviewComponent,
    ReasonRejectionComponent,
    EditCandidateComponent,
    CardMissionCompletedComponent,
    PaymentViewComponent,
    PdfViewComponent,
    NoInterviewsComponent,
    ItemListMissionComponent,
    ChangeOfViewComponent,
    EditPaymentsAdminComponent,
    DateComponent,
    PopoverComponent,
    UsersSummationsComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    PipesModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxExtendedPdfViewerModule
  ],
  exports: [
    AttachFileComponent,
    SeeAttachedComponent,
    MissionCardComponent,
    MissionDataComponent,
    EditMissionComponent,
    CandidateListComponent,
    CandidateDataComponent,
    ModalComponent,
    RequestRefundComponent,
    NoMissionsComponent,
    ValidatePaymentComponent,
    SkeletonCardComponent,
    InterviewAcceptedComponent,
    PendingInterviewComponent,
    ReasonRejectionComponent,
    EditCandidateComponent,
    CardMissionCompletedComponent,
    PaymentViewComponent,
    PdfViewComponent,
    NoInterviewsComponent,
    ItemListMissionComponent,
    ChangeOfViewComponent,
    EditPaymentsAdminComponent,
    DateComponent,
    PopoverComponent,
    UsersSummationsComponent,
  ]
})
export class SharedModule { }
