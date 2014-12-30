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

/**
 * @Route("/admin/galleries")
 */
class GalleriesController extends Controller
{
    /**
     * @Route("/add-image")
     * @Method({"GET"})
     * @Template
     */
    public function addImageAction()
    {

        $form = $this->createForm(new ImageType(), new Image(), array(
            'action' => $this->generateUrl('eam_default_galleries_doimage'),
            'method' => 'POST',
            'attr' => array(
                'novalidate' => 'novalidate'
            )
        ));

        return array(
            'form' => $form->createView()
        );
    }

    /**
     * @Route("/add-image")
     * @Method({"POST"})
     * @Template("EAMDefaultBundle:Galleries:addImage.html.twig")
     */
    public function doImageAction(Request $request)
    {
        $form = $this->createForm(new ImageType(), new Image(), array(
            'action' => $this->generateUrl('eam_default_galleries_doimage'),
            'method' => 'POST',
            'attr' => array(
                'novalidate' => 'novalidate'
            )
        ));

        $success = false;
        $form->handleRequest($request);
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($article);
            $em->flush();

            $sccuess = true;
        }

        return array(
            'form' => $form->createView(),
            'success' => $success
        );
    }

    /**
     * @Route("/add-album")
     * @Method({"GET"})
     * @Template
     */
    public function addAlbumAction()
    {

        $form = $this->createForm(new AlbumType(), new Album(), array(
            'action' => $this->generateUrl('eam_default_galleries_doalbum'),
            'method' => 'POST',
            'attr' => array(
                'novalidate' => 'novalidate'
            )
        ));

        return array(
            'form' => $form->createView()
        );
    }

    /**
     * @Route("/add-album")
     * @Method({"POST"})
     * @Template("EAMDefaultBundle:Galleries:addAlbum.html.twig")
     */
    public function doAlbumAction(Request $request)
    {
        $album = new Album();
        $form = $this->createForm(new AlbumType(), $album, array(
            'action' => $this->generateUrl('eam_default_galleries_doalbum'),
            'method' => 'POST',
            'attr' => array(
                'novalidate' => 'novalidate'
            )
        ));

        $success = false;
        $form->handleRequest($request);
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($album);
            $em->flush();

            $sccuess = true;
        }

        return array(
            'form' => $form->createView(),
            'success' => $success
        );
    }

    /**
     * @Route("/albums")
     * @Method({"GET"})
     * @Template
     */
    public function albumsAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $albums = $em->getRepository('EAMDefaultBundle:Album')->findAll();
        return array(
            'albums' => $albums
        );
    }

    /**
     * @Route("/images")
     * @Method({"GET"})
     * @Template
     */
    public function imagesAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $images = $em->getRepository('EAMDefaultBundle:Image')->findAll();
        return array(
            'images' => $images
        );
    }
}
