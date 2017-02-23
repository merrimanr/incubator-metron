import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Alert} from '../model/alert';
import {Http, Headers, RequestOptions, Response, URLSearchParams} from '@angular/http';
import {HttpUtil} from "../utils/httpUtil";
import {IAppConfig} from '../app.config.interface';
import {APP_CONFIG} from '../app.config';
import {SearchRequest} from "../model/search-request";

@Injectable()
export class AlertService {

  defaultHeaders = {'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest'};
  types = ['bro_doc','snort_doc'];

  constructor(private http: Http, @Inject(APP_CONFIG) private config: IAppConfig) {
  }

    public getAll(): Observable<Alert[]> {
        return Observable.create(observer => {
            observer.next(Alert.getData());
            observer.complete();
        });
    }

  public search(request: SearchRequest): Observable<{}> {
    return this.http.post('/_all/' + this.types.join(',') + '/_search', request, new RequestOptions({headers: new Headers(this.defaultHeaders)}))
      .map(HttpUtil.extractData)
      .catch(HttpUtil.handleError);
  }
}
