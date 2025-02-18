import {UserEntity} from "@app/user/user.entity";
import {Request} from "express";

export interface ExpressRequestInterface extends Request {
    headers?: any;
    user?: UserEntity;

}