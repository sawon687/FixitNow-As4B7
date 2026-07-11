import { Router } from 'express';
import tecnichianController from './tecnichian.controller';



const router=Router()


router.put('/profile',tecnichianController.tecnProfile)


export const technicianRouter=router