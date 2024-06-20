import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { PlaceEntity } from 'src/entities/place.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OpenAPIService {
  serviceKey = process.env.SERVICE_KEY;

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
      console.log(apiUrl);
      console.log(error.message);
      throw new HttpException(
        'Failed to fetch data from OpenAPI',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fetchAttractionTotalCount(
    lang: string,
    apiUrl: string,
  ): Promise<number> {
    try {
      const response = await axios.get(apiUrl);
      const data = response.data;

      switch (lang) {
        case 'eng':
          return data.getAttractionEn.totalCount;
        case 'jpn':
          return data.getAttractionJa.totalCount;
        case 'chs':
          return data.getAttractionZhs.totalCount;
        case 'cht':
          return data.getAttractionZht.totalCount;
      }
    } catch (error) {
      console.log(error.message);
      throw new HttpException(
        'Failed to fetch total count from OpenAPI',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fetchAttractionData(lang: string, apiUrl: string): Promise<any[]> {
    try {
      const response = await axios.get(apiUrl);
      const data = response.data;

      switch (lang) {
        case 'eng':
          return data.getAttractionEn.item;
        case 'jpn':
          return data.getAttractionJa.item;
        case 'chs':
          return data.getAttractionZhs.item;
        case 'cht':
          return data.getAttractionZht.item;
      }
    } catch (error) {
      console.log(error.message);
      throw new HttpException(
        'Failed to fetch data from OpenAPI',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fetchFoodTotalCount(lang: string, apiUrl: string): Promise<number> {
    try {
      const response = await axios.get(apiUrl);
      const data = response.data;

      switch (lang) {
        case 'eng':
          return data.getFoodEn.totalCount;
        case 'jpn':
          return data.getFoodJa.totalCount;
        case 'chs':
          return data.getFoodZhs.totalCount;
        case 'cht':
          return data.getFoodZht.totalCount;
      }
    } catch (error) {
      console.log(error.message);
      throw new HttpException(
        'Failed to fetch total count from OpenAPI',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fetchFoodData(lang: string, apiUrl: string): Promise<any[]> {
    try {
      const response = await axios.get(apiUrl);
      const data = response.data;

      switch (lang) {
        case 'eng':
          return data.getFoodEn.item;
        case 'jpn':
          return data.getFoodJa.item;
        case 'chs':
          return data.getFoodZhs.item;
        case 'cht':
          return data.getFoodZht.item;
      }
    } catch (error) {
      console.log(error.message);
      throw new HttpException(
        'Failed to fetch data from OpenAPI',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async saveFetchData(typeId: string) {
    const baseUrlEng = `https://apis.data.go.kr/B551011/EngService1/areaBasedList1?&MobileOS=IOS&MobileApp=App&_type=JSON&contentTypeId=${typeId}&areaCode=6&serviceKey=${this.serviceKey}`;
    const baseUrlJpn = `https://apis.data.go.kr/B551011/JpnService1/areaBasedList1?MobileOS=IOS&MobileApp=App&_type=JSON&contentTypeId=${typeId}&areaCode=6&serviceKey=${this.serviceKey}`;
    const baseUrlChs = `https://apis.data.go.kr/B551011/ChsService1/areaBasedList1?MobileOS=IOS&MobileApp=App&_type=JSON&contentTypeId=${typeId}&areaCode=6&serviceKey=${this.serviceKey}`;
    const baseUrlCht = `https://apis.data.go.kr/B551011/ChtService1/areaBasedList1?MobileOS=IOS&MobileApp=App&_type=JSON&contentTypeId=${typeId}&areaCode=6&serviceKey=${this.serviceKey}`;

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
      const detailUrlEng = `https://apis.data.go.kr/B551011/EngService1/detailIntro1?MobileOS=IOS&MobileApp=App&_type=JSON&contentId=${dataEng[i].contentid}&contentTypeId=${typeId}&serviceKey=${this.serviceKey}`;
      const detailUrlJpn = `https://apis.data.go.kr/B551011/JpnService1/detailIntro1?MobileOS=IOS&MobileApp=App&_type=JSON&contentId=${dataJpn[i].contentid}&contentTypeId=${typeId}&serviceKey=${this.serviceKey}`;
      const detailUrlChs = `https://apis.data.go.kr/B551011/ChsService1/detailIntro1?MobileOS=IOS&MobileApp=App&_type=JSON&contentId=${dataChs[i].contentid}&contentTypeId=${typeId}&serviceKey=${this.serviceKey}`;
      const detailUrlCht = `https://apis.data.go.kr/B551011/ChtService1/detailIntro1?MobileOS=IOS&MobileApp=App&_type=JSON&contentId=${dataCht[i].contentid}&contentTypeId=${typeId}&serviceKey=${this.serviceKey}`;

      let detailDataEng = await this.fetchData(detailUrlEng);
      let detailDataJpn = await this.fetchData(detailUrlJpn);
      let detailDataChs = await this.fetchData(detailUrlChs);
      let detailDataCht = await this.fetchData(detailUrlCht);

      switch (typeId) {
        // 쇼핑
        case '79':
          const additionalFields79 = {
            openTimeEng: detailDataEng[0].opentime ?? '',
            openTimeJpn: detailDataJpn[0].opentime ?? '',
            openTimeChs: detailDataChs[0].opentime ?? '',
            openTimeCht: detailDataCht[0].opentime ?? '',

            holidayEng: detailDataEng[0].restdateshopping,
            holidayJpn: detailDataJpn[0].restdateshopping,
            holidayChs: detailDataChs[0].restdateshopping,
            holidayCht: detailDataCht[0].restdateshopping,

            parkingEng: detailDataEng[0].parkingshopping,
            parkingJpn: detailDataJpn[0].parkingshopping,
            parkingChs: detailDataChs[0].parkingshopping,
            parkingCht: detailDataCht[0].parkingshopping,

            restroom: detailDataEng[0].restroom.includes('Available'),

            shopguideEng: detailDataEng[0].shopguide,
            shopguideJpn: detailDataJpn[0].shopguide,
            shopguideChs: detailDataChs[0].shopguide,
            shopguideCht: detailDataCht[0].shopguide,
          };
          const place79 = this.createPlace(
            dataEng[i],
            dataJpn[i],
            dataChs[i],
            dataCht[i],
            additionalFields79,
          );
          await this.placeRepository.save(place79);
          break;
        // 숙박
        case '80':
          const additionalFields80 = {
            openTimeEng: detailDataEng[0].opentime ?? '',
            openTimeJpn: detailDataJpn[0].opentime ?? '',
            openTimeChs: detailDataChs[0].opentime ?? '',
            openTimeCht: detailDataCht[0].opentime ?? '',

            parkingEng: detailDataEng[0].parkingshopping,
            parkingJpn: detailDataJpn[0].parkingshopping,
            parkingChs: detailDataChs[0].parkingshopping,
            parkingCht: detailDataCht[0].parkingshopping,

            reservationURL: detailDataEng[0].reservationurl,
            goodStay: detailDataEng[0].goodstay === '0' ? false : true,
            hanok: detailDataEng[0].hanok === '0' ? false : true,
          };
          const place80 = this.createPlace(
            dataEng[i],
            dataJpn[i],
            dataChs[i],
            dataCht[i],
            additionalFields80,
          );
          await this.placeRepository.save(place80);
          break;
      }
    }

    console.log('데이터 저장 완료');
  }

  // 관광지 저장
  async saveAttractionService() {
    const baseUrlEng = `https://apis.data.go.kr/6260000/AttractionService/getAttractionEn?serviceKey=${this.serviceKey}&pageNo=1&resultType=json`;
    const baseUrlJpn = `https://apis.data.go.kr/6260000/AttractionService/getAttractionJa?serviceKey=${this.serviceKey}&pageNo=1&resultType=json`;
    const baseUrlChs = `https://apis.data.go.kr/6260000/AttractionService/getAttractionZhs?serviceKey=${this.serviceKey}&pageNo=1&resultType=json`;
    const baseUrlCht = `https://apis.data.go.kr/6260000/AttractionService/getAttractionZht?serviceKey=${this.serviceKey}&pageNo=1&resultType=json`;

    const totalCountEng = await this.fetchAttractionTotalCount(
      'eng',
      baseUrlEng,
    );
    const totalCountJpn = await this.fetchAttractionTotalCount(
      'jpn',
      baseUrlJpn,
    );
    const totalCountChs = await this.fetchAttractionTotalCount(
      'chs',
      baseUrlChs,
    );
    const totalCountCht = await this.fetchAttractionTotalCount(
      'cht',
      baseUrlCht,
    );

    const apiUrlEng = `${baseUrlEng}&numOfRows=${totalCountEng}`;
    const apiUrlJpn = `${baseUrlJpn}&numOfRows=${totalCountJpn}`;
    const apiUrlChs = `${baseUrlChs}&numOfRows=${totalCountChs}`;
    const apiUrlCht = `${baseUrlCht}&numOfRows=${totalCountCht}`;

    let dataEng = await this.fetchAttractionData('eng', apiUrlEng);
    let dataJpn = await this.fetchAttractionData('jpn', apiUrlJpn);
    let dataChs = await this.fetchAttractionData('chs', apiUrlChs);
    let dataCht = await this.fetchAttractionData('cht', apiUrlCht);

    dataEng = dataEng.filter((data) => data.MAIN_IMG_NORMAL !== '');
    dataJpn = dataJpn.filter((data) => data.MAIN_IMG_NORMAL !== '');
    dataChs = dataChs.filter((data) => data.MAIN_IMG_NORMAL !== '');
    dataCht = dataCht.filter((data) => data.MAIN_IMG_NORMAL !== '');

    let dataIntersection = this.getIntersectionAttractionService(
      dataEng,
      dataJpn,
    );
    dataIntersection = this.getIntersectionAttractionService(
      dataIntersection,
      dataChs,
    );
    dataIntersection = this.getIntersectionAttractionService(
      dataIntersection,
      dataCht,
    );

    dataEng = this.getIntersectionAttractionService(dataEng, dataIntersection);
    dataJpn = this.getIntersectionAttractionService(dataJpn, dataIntersection);
    dataChs = this.getIntersectionAttractionService(dataChs, dataIntersection);
    dataCht = this.getIntersectionAttractionService(dataCht, dataIntersection);

    for (let i = 0; i < dataEng.length; i++) {
      const place = this.placeRepository.create({
        titleEng: dataEng[i].PLACE,
        titleJpn: dataJpn[i].PLACE,
        titleChs: dataChs[i].PLACE,
        titleCht: dataCht[i].PLACE,
        typeId: '76',
        addressEng: dataEng[i].ADDR1,
        addressJpn: dataJpn[i].ADDR1,
        addressChs: dataChs[i].ADDR1,
        addressCht: dataCht[i].ADDR1,
        image: dataEng[i].MAIN_IMG_NORMAL,
        lat: Number(dataEng[i].LAT),
        lng: Number(dataEng[i].LNG),
        tel: dataEng[i].CNTCT_TEL,
        openTimeEng: dataEng[i].USAGE_DAY_WEEK_AND_TIME,
        openTimeJpn: dataJpn[i].USAGE_DAY_WEEK_AND_TIME,
        openTimeChs: dataChs[i].USAGE_DAY_WEEK_AND_TIME,
        openTimeCht: dataCht[i].USAGE_DAY_WEEK_AND_TIME,
        parkingEng: dataEng[i].TRFC_INFO.includes(':')
          ? dataEng[i].TRFC_INFO.slice(
              dataEng[i].TRFC_INFO.indexOf(':') + 1,
            ).trim()
          : '',
        parkingJpn: dataJpn[i].TRFC_INFO.includes('駐車：')
          ? dataJpn[i].TRFC_INFO.slice(
              dataJpn[i].TRFC_INFO.indexOf('駐車：') + '駐車：'.length,
            ).trim()
          : '',
        parkingChs: dataChs[i].TRFC_INFO.includes('停车 ')
          ? dataChs[i].TRFC_INFO.slice(
              dataChs[i].TRFC_INFO.indexOf('停车 ') + '停车 '.length,
            ).trim()
          : '',
        parkingCht: dataCht[i].TRFC_INFO.includes('停車 ')
          ? dataCht[i].TRFC_INFO.slice(
              dataCht[i].TRFC_INFO.indexOf('停車 ') + '停車 '.length,
            ).trim()
          : '',
        holidayEng: dataEng[i].HLDY_INFO,
        holidayJpn: dataJpn[i].HLDY_INFO,
        holidayChs: dataChs[i].HLDY_INFO,
        holidayCht: dataCht[i].HLDY_INFO,
        feeEng: dataEng[i].USAGE_AMOUNT,
        feeJpn: dataJpn[i].USAGE_AMOUNT,
        feeChs: dataChs[i].USAGE_AMOUNT,
        feeCht: dataCht[i].USAGE_AMOUNT,
      });

      await this.placeRepository.save(place);
    }

    console.log('관광지 저장 완료');
  }

  // 음식점 저장
  async saveFoodService() {
    const baseUrlEng = `https://apis.data.go.kr/6260000/FoodService/getFoodEn?serviceKey=${this.serviceKey}&pageNo=1&resultType=json`;
    const baseUrlJpn = `https://apis.data.go.kr/6260000/FoodService/getFoodJa?serviceKey=${this.serviceKey}&pageNo=1&resultType=json`;
    const baseUrlChs = `https://apis.data.go.kr/6260000/FoodService/getFoodZhs?serviceKey=${this.serviceKey}&pageNo=1&resultType=json`;
    const baseUrlCht = `https://apis.data.go.kr/6260000/FoodService/getFoodZht?serviceKey=${this.serviceKey}&pageNo=1&resultType=json`;

    const totalCountEng = await this.fetchFoodTotalCount('eng', baseUrlEng);
    const totalCountJpn = await this.fetchFoodTotalCount('jpn', baseUrlJpn);
    const totalCountChs = await this.fetchFoodTotalCount('chs', baseUrlChs);
    const totalCountCht = await this.fetchFoodTotalCount('cht', baseUrlCht);

    const apiUrlEng = `${baseUrlEng}&numOfRows=${totalCountEng}`;
    const apiUrlJpn = `${baseUrlJpn}&numOfRows=${totalCountJpn}`;
    const apiUrlChs = `${baseUrlChs}&numOfRows=${totalCountChs}`;
    const apiUrlCht = `${baseUrlCht}&numOfRows=${totalCountCht}`;

    let dataEng = await this.fetchFoodData('eng', apiUrlEng);
    let dataJpn = await this.fetchFoodData('jpn', apiUrlJpn);
    let dataChs = await this.fetchFoodData('chs', apiUrlChs);
    let dataCht = await this.fetchFoodData('cht', apiUrlCht);

    dataEng = dataEng.filter((data) => data.MAIN_IMG_NORMAL !== '');
    dataJpn = dataJpn.filter((data) => data.MAIN_IMG_NORMAL !== '');
    dataChs = dataChs.filter((data) => data.MAIN_IMG_NORMAL !== '');
    dataCht = dataCht.filter((data) => data.MAIN_IMG_NORMAL !== '');

    let dataIntersection = this.getIntersectionAttractionService(
      dataEng,
      dataJpn,
    );
    dataIntersection = this.getIntersectionAttractionService(
      dataIntersection,
      dataChs,
    );
    dataIntersection = this.getIntersectionAttractionService(
      dataIntersection,
      dataCht,
    );

    dataEng = this.getIntersectionAttractionService(dataEng, dataIntersection);
    dataJpn = this.getIntersectionAttractionService(dataJpn, dataIntersection);
    dataChs = this.getIntersectionAttractionService(dataChs, dataIntersection);
    dataCht = this.getIntersectionAttractionService(dataCht, dataIntersection);

    for (let i = 0; i < dataEng.length; i++) {
      const place = this.placeRepository.create({
        titleEng: dataEng[i].TITLE,
        titleJpn: dataJpn[i].TITLE,
        titleChs: dataChs[i].TITLE,
        titleCht: dataCht[i].TITLE,
        typeId: '82',
        addressEng: dataEng[i].ADDR1,
        addressJpn: dataJpn[i].ADDR1,
        addressChs: dataChs[i].ADDR1,
        addressCht: dataCht[i].ADDR1,
        image: dataEng[i].MAIN_IMG_NORMAL,
        lat: Number(dataEng[i].LAT),
        lng: Number(dataEng[i].LNG),
        tel: dataEng[i].CNTCT_TEL,
        openTimeEng: dataEng[i].USAGE_DAY_WEEK_AND_TIME,
        openTimeJpn: dataJpn[i].USAGE_DAY_WEEK_AND_TIME,
        openTimeChs: dataChs[i].USAGE_DAY_WEEK_AND_TIME,
        openTimeCht: dataCht[i].USAGE_DAY_WEEK_AND_TIME,
        holidayEng: dataEng[i].HLDY_INFO,
        holidayJpn: dataJpn[i].HLDY_INFO,
        holidayChs: dataChs[i].HLDY_INFO,
        holidayCht: dataCht[i].HLDY_INFO,
        menuEng: dataEng[i].RPRSNTV_MENU,
        menuJpn: dataJpn[i].RPRSNTV_MENU,
        menuChs: dataChs[i].RPRSNTV_MENU,
        menuCht: dataCht[i].RPRSNTV_MENU,
      });

      await this.placeRepository.save(place);
    }

    console.log('음식점 저장 완료');
  }

  createPlace(dataEng, dataJpn, dataChs, dataCht, additionalFields = {}) {
    return this.placeRepository.create({
      titleEng: dataEng.title,
      titleJpn: dataJpn.title,
      titleChs: dataChs.title,
      titleCht: dataCht.title,
      typeId: dataEng.contenttypeid,
      addressEng: dataEng.addr1,
      addressJpn: dataJpn.addr1,
      addressChs: dataChs.addr1,
      addressCht: dataCht.addr1,
      image: dataEng.firstimage,
      lat: Number(dataEng.mapy),
      lng: Number(dataEng.mapx),
      tel: dataEng.tel,
      ...additionalFields,
    });
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

  getIntersectionAttractionService(firstArr, secondArr) {
    const secondArrToSet = new Set(
      secondArr.map((item) => item.MAIN_IMG_NORMAL),
    );

    const filteredArr = firstArr.filter((item) =>
      secondArrToSet.has(item.MAIN_IMG_NORMAL),
    );

    filteredArr.sort((a, b) =>
      a.MAIN_IMG_NORMAL < b.MAIN_IMG_NORMAL
        ? -1
        : a.MAIN_IMG_NORMAL > b.MAIN_IMG_NORMAL
          ? 1
          : 0,
    );

    return filteredArr;
  }
}
