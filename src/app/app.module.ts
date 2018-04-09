import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { CustomMaterialModule } from './custom-material-module.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileAddComponent } from './file-add/file-add.component';
import { ScoreTitlesComponent } from './score-titles/score-titles.component';
import { ScoreBookTitleComponent } from './score-book-titles/score-book-title/score-book-title.component';
import { ScoreBooksComponent } from './score-books/score-books.component';
import { ScoresComponent } from './scores/scores.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { OrchestraComponent } from './orchestra/orchestra.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InstrumentsComponent } from './instruments/instruments.component';
import { ScoreBookTitlesComponent } from './score-book-titles/score-book-titles.component';
import { InstrumentFormComponent } from '@app/add-edit-forms/instrument-form/instrument-form.component';
import { ScoreBookTitleFormComponent } from '@app/add-edit-forms/score-book-title-form/score-book-title-form.component';
import { ScoreTitleFormComponent } from '@app/add-edit-forms/score-title-form/score-title-form.component';
import { ScoreBookFormComponent } from '@app/add-edit-forms/score-book-form/score-book-form.component';
import { ScoreFormComponent } from '@app/add-edit-forms/score-form/score-form.component';
import { DbDictionariesService } from '@app/shared/service/db-dictionaries.service';
import { DataService } from '@app/shared/service/data.service';
import { FileLoaderComponent } from '@app/file-add/file-loader/file-loader.component';
import { FileLoaderItemComponent } from '@app/file-add/file-loader-item/file-loader-item.component';
import { StorageManagerComponent } from './storage-manager/storage-manager.component';
import { StorageFileComponent } from '@app/storage-manager/storage-file/storage-file.component';
import { InputFileComponent } from './input-file/input-file.component';
import { RestService } from '@app/shared/service/rest.service';
import { DisplayFileComponent } from '@app/storage-manager/display-file/display-file.component';
import { FileMetadataEndpointService } from '@app/shared/service/fileService/file-metadata-endpoint.service';
import { PdfPreviewComponent } from '@app/storage-manager/pdf-preview/pdf-preview.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { RegisterComponent } from './register/register.component';
import { AuthorizationService } from '@app/shared/service/authorization.service';
import { HttpReqInterceptor } from '@app/shared/service/interceptor/http-req-interceptor';
import { LoginComponent } from './login/login.component';
import { CanActivateDashboardService } from '@app/shared/service/auth/can-activate-dashboard.service';

@NgModule({
  declarations: [
    AppComponent,
    FileAddComponent,
    ScoreTitlesComponent,
    ScoreBookTitleComponent,
    ScoreBooksComponent,
    ScoresComponent,
    HomeComponent,
    DashboardComponent,
    WelcomeComponent,
    OrchestraComponent,
    UserLoginComponent,
    UserRegisterComponent,
    InstrumentsComponent,
    ScoreBookTitlesComponent,
    InstrumentFormComponent,
    ScoreBookTitleFormComponent,
    ScoreTitleFormComponent,
    ScoreBookFormComponent,
    ScoreFormComponent,
    FileLoaderComponent,
    FileLoaderItemComponent,
    ScoreBooksComponent,
    StorageManagerComponent,
    StorageFileComponent,
    DisplayFileComponent,
    PdfPreviewComponent,
    RegisterComponent,
    LoginComponent
],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FlexLayoutModule,
    CustomMaterialModule,
    PdfViewerModule
  ],
  providers: [
    DataService,
    DbDictionariesService,
    {
      provide: APP_INITIALIZER,
      useFactory: (ds: DbDictionariesService) => function () { return ds; },
      deps: [DbDictionariesService],
      multi: true
    },
    AuthorizationService, 
    {
      provide: APP_INITIALIZER,
      useFactory: (auth: AuthorizationService) => function () { return auth; },
      deps: [AuthorizationService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpReqInterceptor,
      multi: true
    },
    CanActivateDashboardService,
    FileMetadataEndpointService,
    RestService,
  ],
  entryComponents: [
    PdfPreviewComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
