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
 * @Route("/admin/galleries")
 */
class GalleriesController extends Controller
{
    /**
     * @Route("/add-image")
     * @Method({"GET"})
     * @Template
     */
    public function addImageAction(Request $request)
    {
        $idAlbum = $request->get('idAlbum');
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository('EAMDefaultBundle:Album');
        $album = $repository->find($idAlbum);

        $image = new Image();
        $image->setAlbum($album);
        $form = $this->createForm(new ImageType(), $image, array(
            'action' => $this->generateUrl('eam_default_galleries_doimage'),
            'method' => 'POST',
            'attr' => array(
                'novalidate' => 'novalidate'
            )
        ));

        return array(
            'form' => $form->createView(),
            'idAlbum' => $idAlbum
        );
    }

    /**
     * @Route("/add-image")
     * @Method({"POST"})
     * @Template("EAMDefaultBundle:Galleries:addImage.html.twig")
     */
    public function doImageAction(Request $request)
    {
        $idAlbum = $request->request->get('eam_defaultbundle_image')['album'];
        $image = new Image();
        $form = $this->createForm(new ImageType(), $image, array(
            'action' => $this->generateUrl('eam_default_galleries_doimage'),
            'method' => 'POST',
            'attr' => array(
                'novalidate' => 'novalidate'
            )
        ));

        $success = false;
        $form->handleRequest($request);
        if ($form->isValid()) {
            $name = $image->getFile()->getClientOriginalName();

            $uploader = new ImageUploader($this->container);
            $uploader->upload($image->getFile());

            $image->setUrl($uploader->getUploadDir().'/'.$name)->setAlt($name);

            $em = $this->getDoctrine()->getManager();
            $em->persist($image);
            $em->flush();

            $success = true;
        }

        if ($success) {
            return $this->redirect( $this->generateUrl('eam_default_galleries_album', [ 'id' => $idAlbum ]) );
        }

        return array(
            'form' => $form->createView(),
            'success' => $success,
            'idAlbum' => $idAlbum
        );
    }

    /**
     * @Route(path="/delete-image-{id}", requirements={
     *      "id"="\d+"
     * })
     * @Template
     * @Method({"GET"})
     */
    public function deleteImageAction(Request $request, $id)
    {
        $idAlbum = $request->get('idAlbum');
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository('EAMDefaultBundle:Image');
        $image = $repository->find($id);

        if ($image === null) {
            throw $this->createNotFoundException('Image[id='.$id.'] inexistant.');
        }

        $this->get('session')->getFlashBag()->add('info', 'Image bien supprimée');

        // Ici, on gérera la suppression de l'image en question
        $em->remove($image);
        $em->flush();

        return $this->redirect( $this->generateUrl('eam_default_galleries_album', [ 'id' => $idAlbum ]) );
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

            $success = true;
        }

        if ($success) {
            return $this->redirect($this->generateUrl('eam_default_galleries_albums'));
        }

        return array(
            'form' => $form->createView(),
            'success' => $success
        );
    }

    /**
     * @Route("/edit-album-{id}", requirements={
     *            "id"="\d+"
     *        })
     * @Method({"GET"})
     * @Template("EAMDefaultBundle:Galleries:addAlbum.html.twig")
     */
    public function editAlbumAction(Request $request, $id)
    {
        $repository = $this->getDoctrine()->getManager()->getRepository('EAMDefaultBundle:Album');
        $album = $repository->find($id);

        if ($album === null) {
            throw $this->createNotFoundException('Album[id='.$id.'] inexistant.');
        }

        $form = $this->createForm(new AlbumType(), $album, array(
            'action' => $this->generateUrl('eam_default_galleries_doeditalbum', ['id' => $album->getId() ]),
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
     * @Route("/edit-album-{id}", requirements={
     *            "id"="\d+"
     *        })
     * @Method({"POST"})
     * @Template("EAMDefaultBundle:Galleries:addAlbum.html.twig")
     */
    public function doEditAlbumAction(Request $request, $id)
    {
        $repository = $this->getDoctrine()->getManager()->getRepository('EAMDefaultBundle:Album');
        $album = $repository->find($id);

        if ($album === null) {
            throw $this->createNotFoundException('Album[id='.$id.'] inexistant.');
        }

        $form = $this->createForm(new AlbumType(), $album, array(
            'action' => $this->generateUrl('eam_default_galleries_doeditalbum', [ 'id' => $album->getId() ]),
            'method' => 'POST',
            'attr' => array(
                'novalidate' => 'novalidate'
            )
        ));

        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->flush();
        }

        return array(
            'form' => $form->createView()
        );
    }

    /**
     * @Route(path="/delete-album-{id}", requirements={
     *      "id"="\d+"
     * })
     * @Template
     * @Method({"GET"})
     */
    public function deleteAlbumAction($id)
    {
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository('EAMDefaultBundle:Album');
        $album = $repository->find($id);

        if ($album === null) {
            throw $this->createNotFoundException('Album[id='.$id.'] inexistant.');
        }
        $this->get('session')->getFlashBag()->add('info', 'album bien supprimé');

        // Ici, on gérera la suppression de l'album en question
        $em->remove($album);
        $em->flush();

        return $this->redirect( $this->generateUrl('eam_default_galleries_albums') );
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
     * @Route("/album-{id}", requirements={"id"="\d+"})
     * @Method({"GET"})
     * @Template
     */
    public function albumAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository('EAMDefaultBundle:Album');
        $album = $repository->find($id);

        if ($album === null) {
            throw $this->createNotFoundException('Album[id='.$id.'] inexistant.');
        }

        return array(
            'album' => $album
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
