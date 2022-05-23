import type { NextApiRequest, NextApiResponse } from 'next'
import {handleLike} from '../../../services/reactions'
import { withSessionRoute } from '../../../libs/withSession';

 async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    try {
        if(!(req.session as any).user) {
            (req.session as any).user = {
                userId: Math.random().toString(16).slice(3)
            };
            req.session.save();
        }
    
        if(req.method !== 'POST') {
            return res.status(404).json({message: 'Not found'})
        }
    
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        console.log(req.session)
        if(!body.profileId) {
            throw new Error('profileId invalid')
        }
        const result = await handleLike({profileId: body.profileId, userId: (req.session as any).user.userId})
        res.status(200).send(result)
    } catch (error) {
        console.log('error', error)
    }
}

export default withSessionRoute(handler);
