import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxElectronModule } from 'ngx-electron';
import { SortablejsModule } from 'angular-sortablejs';

import { FilesService } from './files.service';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SetupComponent } from './setup/setup.component';
import { PlayerComponent } from './player/player.component';
import { PreviewComponent } from './setup/preview/preview.component';
import {VgCoreModule} from 'videogular2/core';
import {VgControlsModule} from 'videogular2/controls';
import {VgOverlayPlayModule} from 'videogular2/overlay-play';
import {VgBufferingModule} from 'videogular2/buffering';
import { SavePlaylistComponent } from './setup/save-playlist/save-playlist.component';

@NgModule({
  declarations: [
    AppComponent,
    SetupComponent,
    PlayerComponent,
    PreviewComponent,
    SavePlaylistComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxElectronModule,
    SortablejsModule.forRoot({ animation: 150 }),
    NgbModule.forRoot(),
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule
  ],
  providers: [FilesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
