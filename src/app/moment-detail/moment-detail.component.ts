import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-moment-detail',
  templateUrl: './moment-detail.component.html',
  styleUrls: ['./moment-detail.component.scss']
})
export class MomentDetailComponent implements OnInit, OnDestroy {
  params$: Subscription;
  moment: any;

  constructor (
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.params$ = this.route.params.subscribe(params => {
      let id = params['id'];
      this.http.get(`https://api.momentsfrom.earth/moments/${id}`).subscribe(m => {
        this.moment = m;
      });
    });

  }

  ngOnDestroy () {
    this.params$.unsubscribe();
  }

  youtube (id) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${id}?rel=0&amp;showinfo=0`);
  }

}
