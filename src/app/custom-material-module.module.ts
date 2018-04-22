import { NgModule } from '@angular/core';
import {
  MatButtonModule, MatInputModule, MatSortModule,
  MatProgressBarModule, MatPaginatorModule, MatSelectModule,
  MatIconModule, MatSidenavContainer, MatSidenavModule,
  MatCheckboxModule, MatToolbarModule, MatListModule,
  MatCardMdImage, MatCardModule, MatTableModule, MatDialogModule, MatTooltipModule, MatStepperModule, MatAccordion, MatExpansionModule, MatAutocompleteModule, MatProgressSpinnerModule, MatMenu, MatMenuModule
} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatListModule,
    MatCardModule,
    MatDialogModule,
    MatTooltipModule,
    MatStepperModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatMenuModule
  ],
  exports: [
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatListModule,
    MatCardModule,
    MatDialogModule,
    MatTooltipModule,
    MatStepperModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatMenuModule
  ],
})
export class CustomMaterialModule { }