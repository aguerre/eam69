<?php

namespace EAM\DefaultBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use EAM\DefaultBundle\Entity\Image;
use EAM\DefaultBundle\Entity\Album;
use EAM\DefaultBundle\Form\Type\ImageType;
use EAM\DefaultBundle\Form\Type\AlbumType;
use EAM\DefaultBundle\Uploader\ImageUploader;

/**
 * @Route("/admin/partenaires")
 */
class PartenairesController extends Controller
{
	/**
	 * @Route("/")
	 * @Method({"GET"})
	 * @Template
	 */
	public function allAction(Request $request)
	{
		return [];
	}
}
