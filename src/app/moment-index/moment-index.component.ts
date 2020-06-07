import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-moment-index',
  templateUrl: './moment-index.component.html',
  styleUrls: ['./moment-index.component.scss']
})
export class MomentIndexComponent implements OnInit {
  title = 'app';  
  moments: any;

  constructor (private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit () {
    this.http.get('https://api.momentsfrom.earth/search/moments').subscribe(moments => {
      this.moments = this.momentsToDisplay(moments);
    });
  }

  momentsToDisplay (moments) {
    return moments && moments.filter(m => m.visible).reverse();
  }

  youtube (id) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${id}?rel=0&amp;showinfo=0`);
  }
}
