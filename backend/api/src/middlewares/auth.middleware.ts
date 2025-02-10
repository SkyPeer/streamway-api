import {Injectable, NestMiddleware} from '@nestjs/common'
import {Response, NextFunction} from "express"
import {ExpressRequestInterface} from "@app/types/expressRequest.interface";
import {verify} from "jsonwebtoken";
import {JWT_SECRET} from "@app/config";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
        // console.log('auth.middleware', req.headers)
        if(!req.headers.authorization) {
            req.user = null;
            next()
            return;

        }

        const token = req.headers.authorization.split(' ')[1];
        console.log('token', token);

        try {
            const decode = verify(token, JWT_SECRET)
            console.log('decode', decode)
        } catch (err) {
            req.user = null;
        } finally {
            next();
        }


    }

}