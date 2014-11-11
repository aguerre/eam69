<?php

namespace EAM\DefaultBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * @Route("/galleries")
 */
class GalleriesController extends Controller
{
    /**
     * @Route("/add-image")
     * @Template()
     */
    public function addImageAction()
    {
    	
        return array();
    }
}
