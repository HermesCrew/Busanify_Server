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
    const BS_SHOPPING_PREFIX = 'BS_SHOP_';
    const BS_STAY_PREFIX = 'BS_STAY_';
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

    // 삭제 처리
    if (typeId === '79') {
      const apiPlaceIds = dataEng.map(
        (place) => BS_SHOPPING_PREFIX + place.contentid,
      );

      const dbPlaces = await this.placeRepository.find({
        where: { typeId: typeId },
      });
      const dbPlaceIds = dbPlaces.map((place) => place.id);

      const idsToDelete = dbPlaceIds.filter((id) => !apiPlaceIds.includes(id));

      if (idsToDelete.length > 0) {
        await this.placeRepository.delete(idsToDelete);
      }
    } else if (typeId === '80') {
      const apiPlaceIds = dataEng.map(
        (place) => BS_STAY_PREFIX + place.contentid,
      );

      const dbPlaces = await this.placeRepository.find({
        where: { typeId: typeId },
      });
      const dbPlaceIds = dbPlaces.map((place) => place.id);

      const idsToDelete = dbPlaceIds.filter((id) => !apiPlaceIds.includes(id));

      if (idsToDelete.length > 0) {
        await this.placeRepository.delete(idsToDelete);
      }
    }

    // 저장
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
          const id79: string = BS_SHOPPING_PREFIX + dataEng[i].contentid;

          const existingPlace79 = await this.placeRepository.findOne({
            where: { id: id79 },
          });

          if (!existingPlace79) {
            const place79 = this.placeRepository.create({
              id: id79,
              titleEng: this.replaceNewlineWithSpace(dataEng[i].title),
              titleJpn: this.replaceNewlineWithSpace(dataJpn[i].title),
              titleChs: this.replaceNewlineWithSpace(dataChs[i].title),
              titleCht: this.replaceNewlineWithSpace(dataCht[i].title),
              typeId: dataEng[i].contenttypeid,
              addressEng: this.replaceNewlineWithSpace(dataEng[i].addr1),
              addressJpn: this.replaceNewlineWithSpace(dataJpn[i].addr1),
              addressChs: this.replaceNewlineWithSpace(dataChs[i].addr1),
              addressCht: this.replaceNewlineWithSpace(dataCht[i].addr1),
              image: dataEng[i].firstimage,
              lat: Number(dataEng[i].mapy),
              lng: Number(dataEng[i].mapx),
              tel: this.normalizePhoneNumber(dataEng[i].tel),
              openTimeEng: this.extractTimeForShopping(
                detailDataEng[0].opentime,
              ),
              openTimeJpn: this.extractTimeForShopping(
                detailDataEng[0].opentime,
              ),
              openTimeChs: this.extractTimeForShopping(
                detailDataEng[0].opentime,
              ),
              openTimeCht: this.extractTimeForShopping(
                detailDataEng[0].opentime,
              ),

              holidayEng: this.replaceNewlineWithSpace(
                detailDataEng[0].restdateshopping,
              ),
              holidayJpn: this.replaceNewlineWithSpace(
                detailDataJpn[0].restdateshopping,
              ),
              holidayChs: this.replaceNewlineWithSpace(
                detailDataChs[0].restdateshopping,
              ),
              holidayCht: this.replaceNewlineWithSpace(
                detailDataCht[0].restdateshopping,
              ),

              parkingEng: this.normalizeParkingInfo(
                detailDataEng[0].parkingshopping,
              ),
              parkingJpn:
                this.normalizeParkingInfo(detailDataEng[0].parkingshopping) ===
                'Available'
                  ? 'あり'
                  : 'なし',
              parkingChs:
                this.normalizeParkingInfo(detailDataEng[0].parkingshopping) ===
                'Available'
                  ? '可'
                  : '不可',
              parkingCht:
                this.normalizeParkingInfo(detailDataEng[0].parkingshopping) ===
                'Available'
                  ? '有'
                  : '無',

              restroom: detailDataEng[0].restroom.includes('Available'),

              shopguideEng: this.replaceNewlineWithSpace(
                detailDataEng[0].shopguide,
              ),
              shopguideJpn: this.replaceNewlineWithSpace(
                detailDataJpn[0].shopguide,
              ),
              shopguideChs: this.replaceNewlineWithSpace(
                detailDataChs[0].shopguide,
              ),
              shopguideCht: this.replaceNewlineWithSpace(
                detailDataCht[0].shopguide,
              ),
            });
            await this.placeRepository.save(place79);
          } else {
            (existingPlace79.titleEng = this.replaceNewlineWithSpace(
              dataEng[i].title,
            )),
              (existingPlace79.titleJpn = this.replaceNewlineWithSpace(
                dataJpn[i].title,
              )),
              (existingPlace79.titleChs = this.replaceNewlineWithSpace(
                dataChs[i].title,
              )),
              (existingPlace79.titleCht = this.replaceNewlineWithSpace(
                dataCht[i].title,
              )),
              (existingPlace79.addressEng = this.replaceNewlineWithSpace(
                dataEng[i].addr1,
              )),
              (existingPlace79.addressJpn = this.replaceNewlineWithSpace(
                dataJpn[i].addr1,
              )),
              (existingPlace79.addressChs = this.replaceNewlineWithSpace(
                dataChs[i].addr1,
              )),
              (existingPlace79.addressCht = this.replaceNewlineWithSpace(
                dataCht[i].addr1,
              )),
              (existingPlace79.image = dataEng[i].firstimage),
              (existingPlace79.lat = Number(dataEng[i].mapy)),
              (existingPlace79.lng = Number(dataEng[i].mapx)),
              (existingPlace79.tel = this.normalizePhoneNumber(dataEng[i].tel)),
              (existingPlace79.openTimeEng = this.extractTimeForShopping(
                detailDataEng[0].opentime,
              )),
              (existingPlace79.openTimeJpn = this.extractTimeForShopping(
                detailDataEng[0].opentime,
              )),
              (existingPlace79.openTimeChs = this.extractTimeForShopping(
                detailDataEng[0].opentime,
              )),
              (existingPlace79.openTimeCht = this.extractTimeForShopping(
                detailDataEng[0].opentime,
              )),
              (existingPlace79.holidayEng = this.replaceNewlineWithSpace(
                detailDataEng[0].restdateshopping,
              )),
              (existingPlace79.holidayJpn = this.replaceNewlineWithSpace(
                detailDataJpn[0].restdateshopping,
              )),
              (existingPlace79.holidayChs = this.replaceNewlineWithSpace(
                detailDataChs[0].restdateshopping,
              )),
              (existingPlace79.holidayCht = this.replaceNewlineWithSpace(
                detailDataCht[0].restdateshopping,
              )),
              (existingPlace79.parkingEng = this.normalizeParkingInfo(
                detailDataEng[0].parkingshopping,
              )),
              (existingPlace79.parkingJpn =
                this.normalizeParkingInfo(detailDataEng[0].parkingshopping) ===
                'Available'
                  ? 'あり'
                  : 'なし'),
              (existingPlace79.parkingChs =
                this.normalizeParkingInfo(detailDataEng[0].parkingshopping) ===
                'Available'
                  ? '可'
                  : '不可'),
              (existingPlace79.parkingCht =
                this.normalizeParkingInfo(detailDataEng[0].parkingshopping) ===
                'Available'
                  ? '有'
                  : '無'),
              (existingPlace79.restroom =
                detailDataEng[0].restroom.includes('Available')),
              (existingPlace79.shopguideEng = this.replaceNewlineWithSpace(
                detailDataEng[0].shopguide,
              )),
              (existingPlace79.shopguideJpn = this.replaceNewlineWithSpace(
                detailDataJpn[0].shopguide,
              )),
              (existingPlace79.shopguideChs = this.replaceNewlineWithSpace(
                detailDataChs[0].shopguide,
              )),
              (existingPlace79.shopguideCht = this.replaceNewlineWithSpace(
                detailDataCht[0].shopguide,
              )),
              await this.placeRepository.save(existingPlace79);
          }
          break;
        // 숙박
        case '80':
          const id80: string = BS_STAY_PREFIX + dataEng[i].contentid;

          const existingPlace80 = await this.placeRepository.findOne({
            where: { id: id80 },
          });

          if (!existingPlace80) {
            const place80 = this.placeRepository.create({
              id: id80,
              titleEng: this.replaceNewlineWithSpace(dataEng[i].title),
              titleJpn: this.replaceNewlineWithSpace(dataJpn[i].title),
              titleChs: this.replaceNewlineWithSpace(dataChs[i].title),
              titleCht: this.replaceNewlineWithSpace(dataCht[i].title),
              typeId: dataEng[i].contenttypeid,
              addressEng: this.replaceNewlineWithSpace(dataEng[i].addr1),
              addressJpn: this.replaceNewlineWithSpace(dataJpn[i].addr1),
              addressChs: this.replaceNewlineWithSpace(dataChs[i].addr1),
              addressCht: this.replaceNewlineWithSpace(dataCht[i].addr1),
              image: dataEng[i].firstimage,
              lat: Number(dataEng[i].mapy),
              lng: Number(dataEng[i].mapx),
              tel: this.normalizePhoneNumber(dataEng[i].tel),

              openTimeEng:
                this.extractTime(detailDataEng[0].checkintime) +
                '-' +
                this.extractTime(detailDataEng[0].checkouttime),
              openTimeJpn:
                this.extractTime(detailDataEng[0].checkintime) +
                '-' +
                this.extractTime(detailDataEng[0].checkouttime),
              openTimeChs:
                this.extractTime(detailDataEng[0].checkintime) +
                '-' +
                this.extractTime(detailDataEng[0].checkouttime),
              openTimeCht:
                this.extractTime(detailDataEng[0].checkintime) +
                '-' +
                this.extractTime(detailDataEng[0].checkouttime),

              parkingEng: this.normalizeParkingInfo(
                detailDataEng[0].parkinglodging,
              ),
              parkingJpn: this.normalizeParkingInfo(
                detailDataEng[0].parkinglodging,
              )
                ? this.normalizeParkingInfo(detailDataEng[0].parkinglodging) ===
                  'Available'
                  ? 'あり'
                  : 'なし'
                : '',
              parkingChs: this.normalizeParkingInfo(
                detailDataEng[0].parkinglodging,
              )
                ? this.normalizeParkingInfo(detailDataEng[0].parkinglodging) ===
                  'Available'
                  ? '可'
                  : '不可'
                : '',
              parkingCht: this.normalizeParkingInfo(
                detailDataEng[0].parkinglodging,
              )
                ? this.normalizeParkingInfo(detailDataEng[0].parkinglodging) ===
                  'Available'
                  ? '有'
                  : '無'
                : '',

              reservationURL: detailDataEng[0].reservationurl,
              goodStay: detailDataEng[0].goodstay === '0' ? false : true,
              hanok: detailDataEng[0].hanok === '0' ? false : true,
            });
            await this.placeRepository.save(place80);
          } else {
            (existingPlace80.titleEng = this.replaceNewlineWithSpace(
              dataEng[i].title,
            )),
              (existingPlace80.titleJpn = this.replaceNewlineWithSpace(
                dataJpn[i].title,
              )),
              (existingPlace80.titleChs = this.replaceNewlineWithSpace(
                dataChs[i].title,
              )),
              (existingPlace80.titleCht = this.replaceNewlineWithSpace(
                dataCht[i].title,
              )),
              (existingPlace80.addressEng = this.replaceNewlineWithSpace(
                dataEng[i].addr1,
              )),
              (existingPlace80.addressJpn = this.replaceNewlineWithSpace(
                dataJpn[i].addr1,
              )),
              (existingPlace80.addressChs = this.replaceNewlineWithSpace(
                dataChs[i].addr1,
              )),
              (existingPlace80.addressCht = this.replaceNewlineWithSpace(
                dataCht[i].addr1,
              )),
              (existingPlace80.image = dataEng[i].firstimage),
              (existingPlace80.lat = Number(dataEng[i].mapy)),
              (existingPlace80.lng = Number(dataEng[i].mapx)),
              (existingPlace80.tel = this.normalizePhoneNumber(dataEng[i].tel)),
              (existingPlace80.openTimeEng =
                this.extractTime(detailDataEng[0].checkintime) +
                '-' +
                this.extractTime(detailDataEng[0].checkouttime)),
              (existingPlace80.openTimeJpn =
                this.extractTime(detailDataJpn[0].checkintime) +
                '-' +
                this.extractTime(detailDataJpn[0].checkouttime)),
              (existingPlace80.openTimeChs =
                this.extractTime(detailDataChs[0].checkintime) +
                '-' +
                this.extractTime(detailDataChs[0].checkouttime)),
              (existingPlace80.openTimeCht =
                this.extractTime(detailDataCht[0].checkintime) +
                '-' +
                this.extractTime(detailDataCht[0].checkouttime)),
              (existingPlace80.parkingEng = this.normalizeParkingInfo(
                detailDataEng[0].parkinglodging,
              )),
              (existingPlace80.parkingJpn = this.normalizeParkingInfo(
                detailDataEng[0].parkinglodging,
              )
                ? this.normalizeParkingInfo(detailDataEng[0].parkinglodging) ===
                  'Available'
                  ? 'あり'
                  : 'なし'
                : ''),
              (existingPlace80.parkingChs = this.normalizeParkingInfo(
                detailDataEng[0].parkinglodging,
              )
                ? this.normalizeParkingInfo(detailDataEng[0].parkinglodging) ===
                  'Available'
                  ? '可'
                  : '不可'
                : ''),
              (existingPlace80.parkingCht = this.normalizeParkingInfo(
                detailDataEng[0].parkinglodging,
              )
                ? this.normalizeParkingInfo(detailDataEng[0].parkinglodging) ===
                  'Available'
                  ? '有'
                  : '無'
                : ''),
              (existingPlace80.reservationURL =
                detailDataEng[0].reservationurl),
              (existingPlace80.goodStay =
                detailDataEng[0].goodstay === '0' ? false : true),
              (existingPlace80.hanok =
                detailDataEng[0].hanok === '0' ? false : true),
              await this.placeRepository.save(existingPlace80);
          }
          break;
      }
    }

    console.log('데이터 저장 완료');
  }

  // 관광지 저장
  async saveAttractionService() {
    const BS_ATTR_PREFIX = 'BS_ATTR_';
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

    // 삭제 처리
    const apiPlaceIds = dataEng.map((place) => BS_ATTR_PREFIX + place.UC_SEQ);

    const dbPlaces = await this.placeRepository.find({
      where: { typeId: '76' },
    });
    const dbPlaceIds = dbPlaces.map((place) => place.id);

    const idsToDelete = dbPlaceIds.filter((id) => !apiPlaceIds.includes(id));

    if (idsToDelete.length > 0) {
      await this.placeRepository.delete(idsToDelete);
    }

    // 저장
    for (let i = 0; i < dataEng.length; i++) {
      const id: string = BS_ATTR_PREFIX + dataEng[i].UC_SEQ;

      const existingPlace = await this.placeRepository.findOne({
        where: { id: id },
      });

      if (!existingPlace) {
        const place = this.placeRepository.create({
          id: id,
          titleEng: this.replaceNewlineWithSpace(dataEng[i].PLACE),
          titleJpn: this.replaceNewlineWithSpace(dataJpn[i].PLACE),
          titleChs: this.replaceNewlineWithSpace(dataChs[i].PLACE),
          titleCht: this.replaceNewlineWithSpace(dataCht[i].PLACE),
          typeId: '76',
          addressEng: this.replaceNewlineWithSpace(dataEng[i].ADDR1),
          addressJpn: this.replaceNewlineWithSpace(dataJpn[i].ADDR1),
          addressChs: this.replaceNewlineWithSpace(dataChs[i].ADDR1),
          addressCht: this.replaceNewlineWithSpace(dataCht[i].ADDR1),
          image: dataEng[i].MAIN_IMG_NORMAL,
          lat: Number(dataEng[i].LAT),
          lng: Number(dataEng[i].LNG),
          tel: this.normalizePhoneNumber(dataEng[i].CNTCT_TEL),
          openTimeEng: this.extractTimeForAttr(
            dataEng[i].USAGE_DAY_WEEK_AND_TIME,
          ),
          openTimeJpn:
            this.extractTimeForAttr(dataEng[i].USAGE_DAY_WEEK_AND_TIME) ===
            'Open 24 hours'
              ? '24 時間営業'
              : this.extractTimeForAttr(dataEng[i].USAGE_DAY_WEEK_AND_TIME),
          openTimeChs:
            this.extractTimeForAttr(dataEng[i].USAGE_DAY_WEEK_AND_TIME) ===
            'Open 24 hours'
              ? '24 小时营业'
              : this.extractTimeForAttr(dataEng[i].USAGE_DAY_WEEK_AND_TIME),
          openTimeCht:
            this.extractTimeForAttr(dataEng[i].USAGE_DAY_WEEK_AND_TIME) ===
            'Open 24 hours'
              ? '24 小時營業'
              : this.extractTimeForAttr(dataEng[i].USAGE_DAY_WEEK_AND_TIME),
          parkingEng: dataEng[i].TRFC_INFO.includes(':')
            ? 'Available'
            : 'Not available',
          parkingJpn: dataEng[i].TRFC_INFO.includes(':') ? 'あり' : 'なし',
          parkingChs: dataEng[i].TRFC_INFO.includes(':') ? '可' : '不可',
          parkingCht: dataEng[i].TRFC_INFO.includes(':') ? '有' : '無',
          holidayEng: this.replaceNewlineWithSpace(dataEng[i].HLDY_INFO),
          holidayJpn: this.replaceNewlineWithSpace(dataJpn[i].HLDY_INFO),
          holidayChs: this.replaceNewlineWithSpace(dataChs[i].HLDY_INFO),
          holidayCht: this.replaceNewlineWithSpace(dataCht[i].HLDY_INFO),
          feeEng: this.replaceNewlineWithSpace(dataEng[i].USAGE_AMOUNT),
          feeJpn: this.replaceNewlineWithSpace(dataJpn[i].USAGE_AMOUNT),
          feeChs: this.replaceNewlineWithSpace(dataChs[i].USAGE_AMOUNT),
          feeCht: this.replaceNewlineWithSpace(dataCht[i].USAGE_AMOUNT),
        });

        await this.placeRepository.save(place);
      } else {
        existingPlace.titleEng = this.replaceNewlineWithSpace(dataEng[i].PLACE);
        existingPlace.titleJpn = this.replaceNewlineWithSpace(dataJpn[i].PLACE);
        existingPlace.titleChs = this.replaceNewlineWithSpace(dataChs[i].PLACE);
        existingPlace.titleCht = this.replaceNewlineWithSpace(dataCht[i].PLACE);
        existingPlace.addressEng = this.replaceNewlineWithSpace(
          dataEng[i].ADDR1,
        );
        existingPlace.addressJpn = this.replaceNewlineWithSpace(
          dataJpn[i].ADDR1,
        );
        existingPlace.addressChs = this.replaceNewlineWithSpace(
          dataChs[i].ADDR1,
        );
        existingPlace.addressCht = this.replaceNewlineWithSpace(
          dataCht[i].ADDR1,
        );
        existingPlace.image = dataEng[i].MAIN_IMG_NORMAL;
        existingPlace.lat = Number(dataEng[i].LAT);
        existingPlace.lng = Number(dataEng[i].LNG);
        existingPlace.tel = this.normalizePhoneNumber(dataEng[i].CNTCT_TEL);
        existingPlace.openTimeEng = this.extractTimeForAttr(
          dataEng[i].USAGE_DAY_WEEK_AND_TIME,
        );
        existingPlace.openTimeJpn =
          this.extractTimeForAttr(dataEng[i].USAGE_DAY_WEEK_AND_TIME) ===
          'Open 24 hours'
            ? '24 時間営業'
            : this.extractTimeForAttr(dataEng[i].USAGE_DAY_WEEK_AND_TIME);
        existingPlace.openTimeChs =
          this.extractTimeForAttr(dataEng[i].USAGE_DAY_WEEK_AND_TIME) ===
          'Open 24 hours'
            ? '24 小时营业'
            : this.extractTimeForAttr(dataEng[i].USAGE_DAY_WEEK_AND_TIME);
        existingPlace.openTimeCht =
          this.extractTimeForAttr(dataEng[i].USAGE_DAY_WEEK_AND_TIME) ===
          'Open 24 hours'
            ? '24 小時營業'
            : this.extractTimeForAttr(dataEng[i].USAGE_DAY_WEEK_AND_TIME);
        existingPlace.parkingEng = dataEng[i].TRFC_INFO.includes(':')
          ? 'Available'
          : 'Not available';
        existingPlace.parkingJpn = dataEng[i].TRFC_INFO.includes(':')
          ? 'あり'
          : 'なし';
        existingPlace.parkingChs = dataEng[i].TRFC_INFO.includes(':')
          ? '可'
          : '不可';
        existingPlace.parkingCht = dataEng[i].TRFC_INFO.includes(':')
          ? '有'
          : '無';
        existingPlace.holidayEng = this.replaceNewlineWithSpace(
          dataEng[i].HLDY_INFO,
        );
        existingPlace.holidayJpn = this.replaceNewlineWithSpace(
          dataJpn[i].HLDY_INFO,
        );
        existingPlace.holidayChs = this.replaceNewlineWithSpace(
          dataChs[i].HLDY_INFO,
        );
        existingPlace.holidayCht = this.replaceNewlineWithSpace(
          dataCht[i].HLDY_INFO,
        );
        existingPlace.feeEng = this.replaceNewlineWithSpace(
          dataEng[i].USAGE_AMOUNT,
        );
        existingPlace.feeJpn = this.replaceNewlineWithSpace(
          dataJpn[i].USAGE_AMOUNT,
        );
        existingPlace.feeChs = this.replaceNewlineWithSpace(
          dataChs[i].USAGE_AMOUNT,
        );
        existingPlace.feeCht = this.replaceNewlineWithSpace(
          dataCht[i].USAGE_AMOUNT,
        );
        await this.placeRepository.save(existingPlace);
      }
    }

    console.log('관광지 저장 완료');
  }

  // 음식점 저장
  async saveFoodService() {
    const BS_FOOD_PREFIX = 'BS_FOOD_';
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

    // 삭제 처리
    const apiPlaceIds = dataEng.map((place) => BS_FOOD_PREFIX + place.UC_SEQ);

    const dbPlaces = await this.placeRepository.find({
      where: { typeId: '82' },
    });
    const dbPlaceIds = dbPlaces.map((place) => place.id);

    const idsToDelete = dbPlaceIds.filter((id) => !apiPlaceIds.includes(id));

    if (idsToDelete.length > 0) {
      await this.placeRepository.delete(idsToDelete);
    }

    for (let i = 0; i < dataEng.length; i++) {
      const id: string = BS_FOOD_PREFIX + dataEng[i].UC_SEQ;

      const existingPlace = await this.placeRepository.findOne({
        where: { id: id },
      });

      if (!existingPlace) {
        const place = this.placeRepository.create({
          id: id,
          titleEng: this.replaceNewlineWithSpace(dataEng[i].TITLE),
          titleJpn: this.replaceNewlineWithSpace(dataJpn[i].TITLE),
          titleChs: this.replaceNewlineWithSpace(dataChs[i].TITLE),
          titleCht: this.replaceNewlineWithSpace(dataCht[i].TITLE),
          typeId: '82',
          addressEng: this.replaceNewlineWithSpace(dataEng[i].ADDR1),
          addressJpn: this.replaceNewlineWithSpace(dataJpn[i].ADDR1),
          addressChs: this.replaceNewlineWithSpace(dataChs[i].ADDR1),
          addressCht: this.replaceNewlineWithSpace(dataCht[i].ADDR1),
          image: dataEng[i].MAIN_IMG_NORMAL,
          lat: Number(dataEng[i].LAT),
          lng: Number(dataEng[i].LNG),
          tel: this.normalizePhoneNumber(dataEng[i].CNTCT_TEL),
          openTimeEng: this.extractTimeForFood(
            dataEng[i].USAGE_DAY_WEEK_AND_TIME,
          ),
          openTimeJpn:
            this.extractTimeForFood(dataEng[i].USAGE_DAY_WEEK_AND_TIME) ===
            'Open 24 hours'
              ? '24 時間営業'
              : this.extractTimeForFood(dataEng[i].USAGE_DAY_WEEK_AND_TIME),
          openTimeChs:
            this.extractTimeForFood(dataEng[i].USAGE_DAY_WEEK_AND_TIME) ===
            'Open 24 hours'
              ? '24 小时营业'
              : this.extractTimeForFood(dataEng[i].USAGE_DAY_WEEK_AND_TIME),
          openTimeCht:
            this.extractTimeForFood(dataEng[i].USAGE_DAY_WEEK_AND_TIME) ===
            'Open 24 hours'
              ? '24 小時營業'
              : this.extractTimeForFood(dataEng[i].USAGE_DAY_WEEK_AND_TIME),
          menuEng: this.replaceNewlineWithSpace(dataEng[i].RPRSNTV_MENU),
          menuJpn: this.replaceNewlineWithSpace(dataJpn[i].RPRSNTV_MENU),
          menuChs: this.replaceNewlineWithSpace(dataChs[i].RPRSNTV_MENU),
          menuCht: this.replaceNewlineWithSpace(dataCht[i].RPRSNTV_MENU),
        });

        await this.placeRepository.save(place);
      } else {
        existingPlace.titleEng = this.replaceNewlineWithSpace(dataEng[i].TITLE);
        existingPlace.titleJpn = this.replaceNewlineWithSpace(dataJpn[i].TITLE);
        existingPlace.titleChs = this.replaceNewlineWithSpace(dataChs[i].TITLE);
        existingPlace.titleCht = this.replaceNewlineWithSpace(dataCht[i].TITLE);
        existingPlace.typeId = '82';
        existingPlace.addressEng = this.replaceNewlineWithSpace(
          dataEng[i].ADDR1,
        );
        existingPlace.addressJpn = this.replaceNewlineWithSpace(
          dataJpn[i].ADDR1,
        );
        existingPlace.addressChs = this.replaceNewlineWithSpace(
          dataChs[i].ADDR1,
        );
        existingPlace.addressCht = this.replaceNewlineWithSpace(
          dataCht[i].ADDR1,
        );
        existingPlace.image = dataEng[i].MAIN_IMG_NORMAL;
        existingPlace.lat = Number(dataEng[i].LAT);
        existingPlace.lng = Number(dataEng[i].LNG);
        existingPlace.tel = this.normalizePhoneNumber(dataEng[i].CNTCT_TEL);
        existingPlace.openTimeEng = this.extractTimeForFood(
          dataEng[i].USAGE_DAY_WEEK_AND_TIME,
        );
        existingPlace.openTimeJpn =
          this.extractTimeForFood(dataEng[i].USAGE_DAY_WEEK_AND_TIME) ===
          'Open 24 hours'
            ? '24 時間営業'
            : this.extractTimeForFood(dataEng[i].USAGE_DAY_WEEK_AND_TIME);
        existingPlace.openTimeChs =
          this.extractTimeForFood(dataEng[i].USAGE_DAY_WEEK_AND_TIME) ===
          'Open 24 hours'
            ? '24 小时营业'
            : this.extractTimeForFood(dataEng[i].USAGE_DAY_WEEK_AND_TIME);
        existingPlace.openTimeCht =
          this.extractTimeForFood(dataEng[i].USAGE_DAY_WEEK_AND_TIME) ===
          'Open 24 hours'
            ? '24 小時營業'
            : this.extractTimeForFood(dataEng[i].USAGE_DAY_WEEK_AND_TIME);
        existingPlace.menuEng = this.replaceNewlineWithSpace(
          dataEng[i].RPRSNTV_MENU,
        );
        existingPlace.menuJpn = this.replaceNewlineWithSpace(
          dataJpn[i].RPRSNTV_MENU,
        );
        existingPlace.menuChs = this.replaceNewlineWithSpace(
          dataChs[i].RPRSNTV_MENU,
        );
        existingPlace.menuCht = this.replaceNewlineWithSpace(
          dataCht[i].RPRSNTV_MENU,
        );

        await this.placeRepository.save(existingPlace);
      }
    }

    console.log('음식점 저장 완료');
  }

  createPlace(id, dataEng, dataJpn, dataChs, dataCht, additionalFields = {}) {
    return this.placeRepository.create({
      id: id,
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

  replaceNewlineWithSpace(text: string): string {
    return text.replace(/\n/g, ' ');
  }

  extractTime(openTime) {
    const cleanedTime = openTime.replace(/;/g, ':').replace(/\s+/g, '');

    const timeMatch = cleanedTime.match(/\d{2}:\d{2}(?::\d{2})?/);

    if (timeMatch) {
      return timeMatch[0].slice(0, 5);
    }

    return '';
  }

  extractTimeForShopping(openTime) {
    const cleanedTime = openTime.replace(/;/g, ':').replace(/\s+/g, '');

    // 정규식을 사용하여 시간 형식을 추출
    const timeMatch = cleanedTime.match(
      /(\d{1,2}[:]\d{2})[-–~](\d{1,2}[:]\d{2})/,
    );

    if (timeMatch) {
      // 시간을 'HH:MM' 형식으로 맞춤
      let startTime = timeMatch[1].padStart(5, '0');
      let endTime = timeMatch[2].padStart(5, '0');

      // '10:00-20:00' 형식으로 반환
      return `${startTime}-${endTime}`;
    }

    return '';
  }

  extractTimeForAttr(timeRange) {
    const cleanedInfo = timeRange.replace(/\s+/g, '').toLowerCase();

    // 시간을 추출하고 표준 형식으로 변환
    const timeMatch = cleanedInfo.match(
      /(\d{1,2}[:]\d{2})[-–~](\d{1,2}[:]\d{2})/,
    );

    if (timeMatch) {
      // 시간을 'HH:MM' 형식으로 맞춤
      let startTime = timeMatch[1].padStart(5, '0');
      let endTime = timeMatch[2].padStart(5, '0');

      // 'HH:MM-HH:MM' 형식으로 반환
      return `${startTime}-${endTime}`;
    }

    // "Open 24 hours"로 변환할 패턴
    const alwaysOpenPatterns = [
      'openallyearround',
      'open365daysayear',
      'everyday',
      'atalltimes',
      'always',
      '24/7',
    ];

    // "Open 24 hours"로 변환
    if (alwaysOpenPatterns.some((pattern) => cleanedInfo.includes(pattern))) {
      return 'Open 24 hours';
    }

    // 기본 형식 반환
    return '';
  }

  extractTimeForFood(timeRange) {
    timeRange = timeRange.replace(/[\u2013\u2014\u2015\u2212]/g, '-');

    if (this.normalizeOpenCloseTime(timeRange) !== timeRange) {
      return this.normalizeOpenCloseTime(timeRange);
    } else {
      if (this.normalizeAMPMTime(timeRange) !== timeRange) {
        return this.normalizeAMPMTime(timeRange);
      } else {
        if (this.normalizeSlashTime(timeRange) !== timeRange) {
          return this.normalizeSlashTime(timeRange);
        } else {
          if (this.normalizeAMPMDotTime(timeRange) !== timeRange) {
            return this.normalizeAMPMDotTime(timeRange);
          } else {
            if (this.normalizeDashTime(timeRange) !== timeRange) {
              return this.normalizeDashTime(timeRange);
            }
          }
        }
      }
    }

    // "Open 24 hours"로 변환할 패턴
    const alwaysOpenPatterns = ['24hours', 'Open 24 hours', '24 hours'];

    // "Open 24 hours"로 변환
    if (alwaysOpenPatterns.some((pattern) => timeRange.includes(pattern))) {
      return 'Open 24 hours';
    }

    const excludePatterns = [
      'Refer to the website for operating hours',
      'until sold out',
      'until supplies last',
    ];

    excludePatterns.forEach((pattern) => {
      const regex = new RegExp(pattern, 'gi');
      timeRange = timeRange.replace(regex, '');
    });

    return timeRange;
  }

  normalizeOpenCloseTime(timeRange) {
    let cleanedTime = timeRange.replace(/\s+/g, '').toLowerCase();

    // 기본적인 시간 형식 변환
    let openCloseMatch = cleanedTime.match(
      /open\s*(\d{1,2}[:：]\d{2})\s*\/\s*closed\s*(\d{1,2}[:：]\d{2})/,
    );
    let breakTimeMatch = cleanedTime.match(
      /break\s*time\s*(\d{1,2}[:：]\d{2})\s*~\s*(\d{1,2}[:：]\d{2})/,
    );

    if (openCloseMatch) {
      let openTime = openCloseMatch[1].replace('：', ':').padStart(5, '0');
      let closeTime = openCloseMatch[2].replace('：', ':').padStart(5, '0');
      let result = `${openTime}-${closeTime}`;

      if (breakTimeMatch) {
        let breakStart = breakTimeMatch[1].replace('：', ':').padStart(5, '0');
        let breakEnd = breakTimeMatch[2].replace('：', ':').padStart(5, '0');
        result += ` (break time ${breakStart}-${breakEnd})`;
      }

      return result;
    }

    return timeRange; // 변환할 수 없는 경우 원본 반환
  }

  normalizeAMPMTime(timeRange) {
    let cleanedTime = timeRange.replace(/\s+/g, '').toLowerCase();

    // 기본적인 시간 형식 변환
    let openCloseMatch = cleanedTime.match(
      /(am|pm)\s*(\d{1,2}[:：]\d{2})\s*[-–~]\s*(am|pm)\s*(\d{1,2}[:：]\d{2})/,
    );
    let breakTimeMatch = cleanedTime.match(
      /break\s*time\s*(\d{1,2}[:：]\d{2})\s*[-–~]\s*(\d{1,2}[:：]\d{2})/,
    );

    if (openCloseMatch) {
      let openPeriod = openCloseMatch[1];
      let openTime = openCloseMatch[2].replace('：', ':').padStart(5, '0');
      let closePeriod = openCloseMatch[3];
      let closeTime = openCloseMatch[4].replace('：', ':').padStart(5, '0');

      let result = `${openTime}-${closeTime}`;

      if (breakTimeMatch) {
        let breakStart = breakTimeMatch[1].replace('：', ':').padStart(5, '0');
        let breakEnd = breakTimeMatch[2].replace('：', ':').padStart(5, '0');
        result += ` (break time ${breakStart}-${breakEnd})`;
      }

      return result;
    }
    return timeRange;
  }

  normalizeAMPMDotTime(timeRange) {
    let cleanedTime = timeRange.replace(/\s+/g, '').toLowerCase();

    // 기본적인 시간 형식 변환
    let openCloseMatch = cleanedTime.match(
      /(\d{1,2}[:：]\d{2})(a.m.|p.m.)[~-](\d{1,2}[:：]\d{2})(a.m.|p.m.)/,
    );
    let breakTimeMatch = cleanedTime.match(
      /break\s*time\s*(\d{1,2}[:：]\d{2})\s*[-–~]\s*(\d{1,2}[:：]\d{2})/,
    );

    if (openCloseMatch) {
      let openTime = openCloseMatch[1].replace('：', ':').padStart(5, '0');
      let openPeriod = openCloseMatch[2];
      let closeTime = openCloseMatch[3].replace('：', ':').padStart(5, '0');
      let closePeriod = openCloseMatch[4];

      let result = `${openTime}-${closeTime}`;

      if (breakTimeMatch) {
        let breakStart = breakTimeMatch[1].replace('：', ':').padStart(5, '0');
        let breakEnd = breakTimeMatch[2].replace('：', ':').padStart(5, '0');
        result += ` (break time ${breakStart}-${breakEnd})`;
      }

      return result;
    }
    return timeRange;
  }

  normalizeSlashTime(timeRange) {
    let cleanedTime = timeRange.replace(/\s+/g, '').toLowerCase();

    // 기본적인 시간 형식 변환
    let openCloseMatch = cleanedTime.match(
      /(\d{1,2}[:：]\d{2})\s*[-–~]\s*(\d{1,2}[:：]\d{2})\s*\/\s*(\d{1,2}[:：]\d{2})\s*[-–~]\s*(\d{1,2}[:：]\d{2})/,
    );

    if (openCloseMatch) {
      let openTime = openCloseMatch[1].replace('：', ':').padStart(5, '0');
      let breakStart = openCloseMatch[2].replace('：', ':').padStart(5, '0');
      let breakEnd = openCloseMatch[3].replace('：', ':').padStart(5, '0');
      let closeTime = openCloseMatch[4].replace('：', ':').padStart(5, '0');

      let result = `${openTime}-${closeTime} (break time ${breakStart}-${breakEnd})`;
      return result;
    }
    return timeRange;
  }

  normalizeDashTime(timeRange) {
    let cleanedTime = timeRange.replace(/\s+/g, '').toLowerCase();

    const timeMatch = cleanedTime.match(
      /(\d{1,2}[:]\d{2})[-–~](\d{1,2}[:]\d{2})/,
    );

    if (timeMatch) {
      // 시간을 'HH:MM' 형식으로 맞춤
      let startTime = timeMatch[1].padStart(5, '0');
      let endTime = timeMatch[2].padStart(5, '0');

      // '10:00-20:00' 형식으로 반환
      return `${startTime}-${endTime}`;
    }

    return timeRange;
  }

  normalizeParkingInfo(parkingInfo) {
    const infoLower = parkingInfo.replace(/\s+/g, '').toLowerCase();

    if (
      infoLower.includes('notavailable') ||
      infoLower.includes('no') ||
      infoLower.includes('not')
    ) {
      return 'Not available';
    }

    if (
      infoLower.includes('available') ||
      infoLower.includes('yes') ||
      infoLower.includes('parking')
    ) {
      return 'Available';
    }

    return parkingInfo;
  }

  normalizePhoneNumber(phoneNumber) {
    let cleanedNumber = phoneNumber.replace(/(\+82\-|\+82\s|82\)\+)/g, '0');

    cleanedNumber = cleanedNumber.replace(/(\+52\-|52\)\+)/g, '0');

    cleanedNumber = cleanedNumber.replace(/~\d+/g, '');

    cleanedNumber = cleanedNumber.replace(/\s+/g, '');

    const phoneMatch = cleanedNumber.match(/(0\d{2,3})-(\d{3,4})-(\d{4})/);

    if (phoneMatch) {
      return `${phoneMatch[1]}-${phoneMatch[2]}-${phoneMatch[3]}`;
    }

    return '';
  }
}
