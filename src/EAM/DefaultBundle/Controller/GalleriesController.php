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
     * @requestMethod({"GET"})
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
            'form' => $form
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
            'form' => $form,
            'success' => $success
        );
    }

    /**
     * @Route("/add-album")
     * @requestMethod({"GET"})
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
            'form' => $form
        );
    }

    /**
     * @Route("/add-album")
     * @Method({"POST"})
     * @Template("EAMDefaultBundle:Galleries:addAlbum.html.twig")
     */
    public function doAlbumAction(Request $request)
    {
        $form = $this->createForm(new AlbumType(), new Album(), array(
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
            $em->persist($article);
            $em->flush();

            $sccuess = true;
        }

        return array(
            'form' => $form,
            'success' => $success
        );
    }
}
