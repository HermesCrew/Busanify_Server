import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { PlaceEntity } from 'src/entity/place.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OpenAPIService {
  constructor(
    @InjectRepository(PlaceEntity)
    private placeRepository: Repository<PlaceEntity>,
  ) {}

  async fetchTotalCount(apiUrl: string): Promise<number> {
    try {
      const response = await axios.get(apiUrl);
      const data = response.data;
      return data.response.body.totalCount;
    } catch (error) {
      console.log(error.message);
      throw new HttpException(
        'Failed to fetch total count from OpenAPI',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fetchData(apiUrl: string): Promise<any[]> {
    try {
      const response = await axios.get(apiUrl);
      const data = response.data;
      return data.response.body.items.item;
    } catch (error) {
      console.log(error.message);
      throw new HttpException(
        'Failed to fetch data from OpenAPI',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async saveFetchData() {
    const serviceKey = '';
    const baseUrlEng = `https://apis.data.go.kr/B551011/EngService1/areaBasedList1?&MobileOS=IOS&MobileApp=app&_type=JSON&areaCode=6&serviceKey=${serviceKey}`;
    const baseUrlJpn = `https://apis.data.go.kr/B551011/JpnService1/areaBasedList1?MobileOS=IOS&MobileApp=App&_type=JSON&areaCode=6&serviceKey=${serviceKey}`;
    const baseUrlChs = `https://apis.data.go.kr/B551011/ChsService1/areaBasedList1?MobileOS=IOS&MobileApp=App&_type=JSON&areaCode=6&serviceKey=${serviceKey}`;
    const baseUrlCht = `https://apis.data.go.kr/B551011/ChtService1/areaBasedList1?MobileOS=IOS&MobileApp=App&_type=JSON&areaCode=6&serviceKey=${serviceKey}`;

    const totalCountEng = await this.fetchTotalCount(baseUrlEng);
    const totalCountJpn = await this.fetchTotalCount(baseUrlJpn);
    const totalCountChs = await this.fetchTotalCount(baseUrlChs);
    const totalCountCht = await this.fetchTotalCount(baseUrlCht);

    const apiUrlEng = `${baseUrlEng}&numOfRows=${totalCountEng}`;
    const apiUrlJpn = `${baseUrlJpn}&numOfRows=${totalCountJpn}`;
    const apiUrlChs = `${baseUrlChs}&numOfRows=${totalCountChs}`;
    const apiUrlCht = `${baseUrlCht}&numOfRows=${totalCountCht}`;

    let dataEng = await this.fetchData(apiUrlEng);
    let dataJpn = await this.fetchData(apiUrlJpn);
    let dataChs = await this.fetchData(apiUrlChs);
    let dataCht = await this.fetchData(apiUrlCht);

    dataEng = dataEng.filter((data) => data.firstimage !== '');
    dataJpn = dataJpn.filter((data) => data.firstimage !== '');
    dataChs = dataChs.filter((data) => data.firstimage !== '');
    dataCht = dataCht.filter((data) => data.firstimage !== '');

    let dataIntersection = this.getIntersection(dataEng, dataJpn);
    dataIntersection = this.getIntersection(dataIntersection, dataChs);
    dataIntersection = this.getIntersection(dataIntersection, dataCht);

    dataEng = this.getIntersection(dataEng, dataIntersection);
    dataJpn = this.getIntersection(dataJpn, dataIntersection);
    dataChs = this.getIntersection(dataChs, dataIntersection);
    dataCht = this.getIntersection(dataCht, dataIntersection);

    for (let i = 0; i < dataEng.length; i++) {
      const place = this.placeRepository.create({
        titleEng: dataEng[i].title,
        titleJpn: dataJpn[i].title,
        titleChs: dataChs[i].title,
        titleCht: dataCht[i].title,
        type: dataEng[i].contenttypeid,
        addressEng: dataEng[i].addr1,
        addressJpn: dataJpn[i].addr1,
        addressChs: dataChs[i].addr1,
        addressCht: dataCht[i].addr1,
        firstImage: dataEng[i].firstimage,
        secondImage: dataEng[i].firstimage2,
        latitude: Number(dataEng[i].mapy),
        longitude: Number(dataEng[i].mapx),
        zipcode: dataEng[i].zipcode,
      });

      await this.placeRepository.save(place);
    }
  }

  getIntersection(firstArr, secondArr) {
    const secondArrToSet = new Set(secondArr.map((item) => item.firstimage));

    const filteredArr = firstArr.filter((item) =>
      secondArrToSet.has(item.firstimage),
    );

    filteredArr.sort((a, b) =>
      a.firstimage < b.firstimage ? -1 : a.firstimage > b.firstimage ? 1 : 0,
    );

    return filteredArr;
  }
}
