import { INestApplication } from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';

/**
 * @author MyeongSeok
 * @description Swagger 세팅
 */
export class SwaggerSetup {
  private app: INestApplication;

  constructor(app: INestApplication) {
    this.app = app;
  }

  setup(): void {
    //웹 페이지를 새로고침을 해도 Token 값 유지
    const swaggerCustomOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
      },
    };

    const swaggerConfig = new DocumentBuilder()
      .setTitle("API DOCS - let's Git it")
      .setDescription("The let's Git it API description")
      .setVersion('1.0.0')
      .addTag('Auth')
      .addTag('Community')
      .addTag('Ranks')
      .addTag('User')
      //JWT 토큰 설정
      .addOAuth2(
        {
          type: 'oauth2',
          scheme: 'Bearer',
          name: 'Authorization',
          in: 'header',
        },
        'accessToken',
      )
      .build();

    const swaggerOptions: SwaggerDocumentOptions = {
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        methodKey,
    };

    const swaggerDocs = SwaggerModule.createDocument(
      this.app,
      swaggerConfig,
      swaggerOptions,
    );

    SwaggerModule.setup(
      'api-docs',
      this.app,
      swaggerDocs,
      swaggerCustomOptions,
    );
  }
}
